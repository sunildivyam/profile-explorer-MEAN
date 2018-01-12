import {BasicInfo} from './basic-info';
import {SocialMedia} from './social-media';
import {Employer} from './employer';
import {Skill} from './skill';
import {Project} from './project';
import {Education} from './education';
import {Additional} from './additional';

export class UserProfile {
    _id: string;
	basicInfo: BasicInfo;
    socialMedia:Array<SocialMedia>;
	employers: Array<Employer>;
	skills: Array<Skill>;
	projects: Array<Project>;
	education: Array<Education>;
	additionals: Array<Additional>;
		
	constructor() {
		this._id = "";
		this.basicInfo = new BasicInfo();
		this.socialMedia = new Array<SocialMedia>();
		this.employers = new Array<Employer>();
		this.skills = new Array<Skill>();
		this.projects = new Array<Project>();
		this.education = new Array<Education>();
		this.additionals = new Array<Additional>();
	}
}
