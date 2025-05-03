export namespace auth {
	
	export class UserDetails {
	    username: string;
	    name: string;
	    lastName?: string;
	    email: string;
	    avatarUrl: string;
	
	    static createFrom(source: any = {}) {
	        return new UserDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.name = source["name"];
	        this.lastName = source["lastName"];
	        this.email = source["email"];
	        this.avatarUrl = source["avatarUrl"];
	    }
	}

}

export namespace model {
	
	export class DataSource {
	    id: string;
	    label: string;
	    type: string;
	    path: string;
	    format: string;
	    storage?: string;
	    fields?: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new DataSource(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.label = source["label"];
	        this.type = source["type"];
	        this.path = source["path"];
	        this.format = source["format"];
	        this.storage = source["storage"];
	        this.fields = source["fields"];
	    }
	}
	export class Config {
	    version?: string;
	    projectName: string;
	    projectId: string;
	    content: DataSource[];
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.projectName = source["projectName"];
	        this.projectId = source["projectId"];
	        this.content = this.convertValues(source["content"], DataSource);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Project {
	    id: string;
	    name: string;
	    repoName: string;
	    owner: string;
	    configRef: string;
	    config?: Config;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.repoName = source["repoName"];
	        this.owner = source["owner"];
	        this.configRef = source["configRef"];
	        this.config = this.convertValues(source["config"], Config);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

