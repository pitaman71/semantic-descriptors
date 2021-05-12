import * as Elevated from 'elevated-objects';

const __module__ = 'Markup';

export abstract class Markup extends Elevated.Serializable {
    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.endObject(this);
    }
}

export class Empty extends Markup {
    getClassSpec() { return `${__module__}.Empty`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.endObject(this);
    }
}

export class Section extends Markup {
    contents: Markup[] = [];

    getClassSpec() { return `${__module__}.Section`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.array<Markup>(this, 'contents');
        visitor.endObject(this);
    }
}

export class Header extends Markup {
    text?: string;

    getClassSpec() { return `${__module__}.Header`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }
    toString(): string { return this.text||'' }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.primitive<string>(this, 'text');
        visitor.endObject(this);
    }
}

export class Callout extends Markup {
    text?: string;

    getClassSpec() { return `${__module__}.Callout`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }
    toString(): string { return this.text||'' }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.primitive<string>(this, 'text');
        visitor.endObject(this);
    }
}

export class Paragraph extends Markup {
    text?: string;

    getClassSpec() { return `${__module__}.Paragraph`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }
    toString(): string { return this.text||'' }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.primitive<string>(this, 'text');
        visitor.endObject(this);
    }
}

export class Unit extends Markup {
    name?: string;
    abbreviation?: string;

    getClassSpec() { return `${__module__}.Unit`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.primitive<string>(this, 'name');
        visitor.primitive<string>(this, 'abbreviation');
        visitor.endObject(this);
    }
}

export class Description extends Markup {
    name?: string;
    text?: string;
    unit?: Unit;
    amount?: number;

    getClassSpec() { return `${__module__}.Description`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.primitive<string>(this, 'name');
        visitor.primitive<string>(this, 'text');
        visitor.primitive<number>(this, 'amount');
        visitor.endObject(this);
    }
}

export class Descriptions extends Markup {
    descriptors: Description[] = [];

    getClassSpec() { return `${__module__}.Descriptions`; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.array<Description>(this, 'descriptors');
        visitor.endObject(this);
    }
}

export const builders = [
    () => new Elevated.Builder(`${__module__}.Empty`, (initializer?: any) => new Empty(initializer)),
    () => new Elevated.Builder(`${__module__}.Section`, (initializer?: any) => new Section(initializer)),
    () => new Elevated.Builder(`${__module__}.Header`, (initializer?: any) => new Header(initializer)),
    () => new Elevated.Builder(`${__module__}.Callout`, (initializer?: any) => new Callout(initializer)),
    () => new Elevated.Builder(`${__module__}.Paragraph`, (initializer?: any) => new Paragraph(initializer)),
    () => new Elevated.Builder(`${__module__}.Unit`, (initializer?: any) => new Unit(initializer)),
    () => new Elevated.Builder(`${__module__}.Description`, (initializer?: any) => new Description(initializer)),
    () => new Elevated.Builder(`${__module__}.Descriptions`, (initializer?: any) => new Descriptions(initializer)),
];
