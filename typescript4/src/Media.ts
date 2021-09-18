import * as Elevated from 'elevated-objects';
import * as MarkupData from './Markup';

export interface Extent2D {
    "width": number, 
    "height": number
};

export abstract class Media extends Elevated.Serializable {
    slug?: string;
    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        visitor.primitive<string>(this, 'slug');
        visitor.end(this);
    }
}

export class Show extends Media {
    title?: string;
    scenes: Scene[] = [];
    getClassSpec() { return 'Media.Show'; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }
    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        super.marshal(visitor);
        visitor.primitive<string>(this, 'title');
        visitor.array<Scene>(this, 'scenes');
        visitor.end(this);
    }
}

export class Scene extends Media {
    title?: string;
    duration?: number;
    assets: Media[] = [];
    getClassSpec() { return 'Media.Scene'; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }
    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        super.marshal(visitor);
        visitor.primitive<string>(this, 'title');
        visitor.primitive<number>(this, 'duration');
        visitor.array<Media>(this, 'assets');
        visitor.end(this);
    }
}

export class Playlist extends Media {
    slug?: string;
    tags: string[] = [];
    contents: Media[] = [];
    shuffle?: boolean;
    repeat?: boolean;
    getClassSpec() { return 'Media.Playlist'; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }
    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        super.marshal(visitor);
        visitor.primitive<string>(this, 'slug');
        visitor.primitive<string[]>(this, 'tags');
        visitor.array<Media>(this, 'contents');
        visitor.primitive<boolean>(this, 'shuffle');
        visitor.primitive<boolean>(this, 'repeat');
        visitor.end(this);
    }
}

export class Markup extends Media {
    content?: MarkupData.Markup;

    getClassSpec() { return 'Media.Markup'; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        super.marshal(visitor);
        visitor.scalar<MarkupData.Markup>(this, 'content');
        visitor.end(this);
    }
}

export class Image extends Media {
    pixels?: Extent2D;
    tags: string[] = [];
    proximity?: number;
    uri?: string;

    getClassSpec() { return 'Media.Image'; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        super.marshal(visitor);
        visitor.primitive<Extent2D>(this, 'pixels');
        visitor.primitive<string[]>(this, 'tags');
        visitor.primitive<number>(this, 'proximity');
        visitor.primitive<string>(this, 'uri');
        visitor.end(this);
    }
}

export class BoxCastStream extends Media {
    pixels?: Extent2D;
    duration?: number;
    tags: string[] = [];
    broadcastId?: string;
    poster?: string;
    volume?: number;

    getClassSpec() { return 'Media.BoxCastStream'; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.begin(this);
        super.marshal(visitor);
        visitor.primitive<Extent2D>(this, 'pixels');
        visitor.primitive<number>(this, 'duration');
        visitor.primitive<string[]>(this, 'tags');
        visitor.primitive<string>(this, 'broadcastId');
        visitor.primitive<string>(this, 'poster');
        visitor.primitive<number>(this, 'volume');
        visitor.end(this);
    }
}

export const builders = [
    () => new Elevated.Builder("Media.Show", (initializer?: any) => new Show(initializer)),
    () => new Elevated.Builder("Media.Scene", (initializer?: any) => new Scene(initializer)),
    () => new Elevated.Builder("Media.Playlist", (initializer?: any) => new Playlist(initializer)),
    () => new Elevated.Builder("Media.Markup", (initializer?: any) => new Markup(initializer)),
    () => new Elevated.Builder("Media.Image", (initializer?: any) => new Image(initializer)),
    () => new Elevated.Builder("Media.BoxCastStream", (initializer?: any) => new BoxCastStream(initializer))
];
