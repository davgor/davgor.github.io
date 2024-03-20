import {Page} from '@playwright/test'

export class Navigation {
    protected page: Page;

    public constructor(page: Page) {
        this.page = page;
    }
    
    public NavigateAboutMe = async (): Promise<void> => {
        await this.page.getByRole('link', { name: 'About Me' }).click();
    };

    public NavigateExperience = async (): Promise<void> => {
        await this.page.getByRole('link', { name: 'Experience' }).click();
    };

    public NavigateCodingReference = async (): Promise<void> => {
        await this.page.getByRole('link', { name: 'Coding Reference' }).click();
    };

    public NavigateDogs = async (): Promise<void> => {
        await this.page.getByRole('link', { name: 'Dogs!' }).click();
    };

    public NavigateHobbies = async (): Promise<void> => {
        await this.page.getByRole('link', { name: 'Hobbies' }).click();
    };
    
    public NavigateContactMe = async (): Promise<void> => {
        await this.page.getByRole('link', { name: 'Contact Me' }).click();
    };

}
