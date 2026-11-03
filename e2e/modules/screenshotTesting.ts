import { Locator, Page } from '@playwright/test';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ScreenshotInteraction {
  protected page: Page;
  protected screenshotPath: string;
  protected screenshotDB: allKnownElements;

  public constructor(page: Page) {
    this.page = page;
    this.screenshotPath = path.join(__dirname, 'screenshots');
    this.ensureScreenshotFolder();
    this.loadScreenshotDB();
  }

  async interact(
    selector: Locator,
    options: options = { click: 'center', type: 'leftClick', count: 1, speed: 50 }
  ) {
    const existing = this.screenshotDB.elements.find((x) => x.locator === selector);
    if (existing) {
      const coords = await this.findLocatorViaScreenshot(existing.screenshotPath);
      if (coords === null) {
        await this.captureScreenshot(selector);
        await this.interact(selector, options);
      } else {
        //TODO: perform the requested interaction with the element
      }
    } else {
      await this.captureScreenshot(selector);
      await this.interact(selector);
    }
  }

  async findLocatorViaScreenshot(buttonScreenshotPath: string) {
    const screenshot = PNG.sync.read(await this.page.screenshot({ fullPage: true }));
    const buttonScreenshot = PNG.sync.read(fs.readFileSync(buttonScreenshotPath));

    const screenshotWidth = screenshot.width;
    const screenshotHeight = screenshot.height;
    const buttonWidth = buttonScreenshot.width;
    const buttonHeight = buttonScreenshot.height;

    // PNG.data is RGBA, 4 bytes per pixel, row-major.
    const pixelMatches = (sx: number, sy: number, bx: number, by: number) => {
      const s = (sy * screenshotWidth + sx) * 4;
      const b = (by * buttonWidth + bx) * 4;
      return (
        screenshot.data[s] === buttonScreenshot.data[b] &&
        screenshot.data[s + 1] === buttonScreenshot.data[b + 1] &&
        screenshot.data[s + 2] === buttonScreenshot.data[b + 2] &&
        screenshot.data[s + 3] === buttonScreenshot.data[b + 3]
      );
    };

    for (let x = 0; x < screenshotWidth - buttonWidth; x++) {
      for (let y = 0; y < screenshotHeight - buttonHeight; y++) {
        let match = true;
        for (let bx = 0; bx < buttonWidth; bx++) {
          for (let by = 0; by < buttonHeight; by++) {
            if (!pixelMatches(x + bx, y + by, bx, by)) {
              match = false;
              break;
            }
          }
          if (!match) break;
        }
        if (match) {
          return { x, y };
        }
      }
    }
    return null;
  }

  async captureScreenshot(selector: Locator) {
    const guid = uuidv4();
    const buttonScreenshotPath = path.join(this.screenshotPath, `${guid}.png`);
    await selector.screenshot({ path: buttonScreenshotPath });
    const caputredElement: CapturedElement = {
      locator: selector,
      screenshotPath: buttonScreenshotPath,
    };
    this.screenshotDB.elements.push(caputredElement);
    this.saveScreenshotDB();
  }

  private loadScreenshotDB() {
    const path = this.screenshotPath + '/screenshotDB.ts';
    if (fs.existsSync(this.screenshotPath)) {
      const data = fs.readFileSync(this.screenshotPath, 'utf8');
      this.screenshotDB = JSON.parse(data);
    } else {
      this.saveScreenshotDB();
    }
  }

  private saveScreenshotDB() {
    const path = this.screenshotPath + '/screenshotDB.ts';
    fs.writeFileSync(path, JSON.stringify(this.screenshotDB, null, 2));
  }

  private ensureScreenshotFolder() {
    if (!fs.existsSync(this.screenshotPath)) {
      fs.mkdirSync(this.screenshotPath, { recursive: true });
      console.log(`Folder '${this.screenshotPath}' created successfully.`);
    }
  }
}

interface allKnownElements {
  elements: CapturedElement[];
}

interface CapturedElement {
  locator: Locator;
  screenshotPath: string;
}
interface options {
  click?: 'left' | 'center' | 'right';
  type?: 'leftClick' | 'rightClick';
  count?: number;
  speed?: number;
}
