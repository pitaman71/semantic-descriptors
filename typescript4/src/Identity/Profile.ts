import * as Elevated from 'elevated-objects';
import * as FormData from '../Form';
import * as Markup from '../Markup';

export class Observation extends Elevated.Serializable {
    systemId?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    privilege?: string[];

    getClassSpec() { return "Identity.Profile.Observation"; }
    constructor(initializer?: any) { super(); this.overlay(... initializer ? [ initializer ] : []); }

    marshal(visitor: Elevated.Visitor<this>) {
        visitor.beginObject(this);
        visitor.primitive<string>(this, 'systemId');
        visitor.primitive<string>(this, 'displayName');
        visitor.primitive<string>(this, 'firstName');
        visitor.primitive<string>(this, 'lastName');
        visitor.primitive<string>(this, 'email');
        visitor.primitive<string>(this, 'phone');
        visitor.primitive<string[]>(this, 'privilege');
        visitor.endObject(this);
    }
}

export class Form extends FormData.Form<Observation> {
    constructor(props: {
        title?: () => Markup.Markup,
        prologue?: () => Markup.Markup,
        epilogue?: () => Markup.Markup,
        validator?: (state:Observation) => boolean,
        actions: () => FormData.Action<Observation>[]
    }) {
        super({
            initialState: () => new Observation(),
            title: () => new Markup.Header('Profile'),
            prologue: () => new Markup.Empty(),
            epilogue: () => new Markup.Empty(),
            validator: (state:Observation) => true,
            actions: props.actions
        });
    }
}

export const builders = [
    () => new Elevated.Builder("Identity.Profile.Observation", (initializer?: any) => new Observation(initializer))
];
