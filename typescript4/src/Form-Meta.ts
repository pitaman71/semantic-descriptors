import * as Elevated from 'elevated-objects';
import * as Markup from './Markup';

export enum Status {
    Unknown = 0,
    Closed = 1,
    Reset = 2,
    Editing = 3,
    Validation = 4,
    Negotiation = 5,
    Success = 6
}

export class Constraint<StateT extends Elevated.Serializable> {
    predicate: (service: Interface<StateT>) => boolean;
    feedback: (service: Interface<StateT>) => Markup.Markup;

    constructor(
        predicate: (service: Interface<StateT>) => boolean,
        feedback: (service: Interface<StateT>) => Markup.Markup
    ) {
        this.predicate = predicate;
        this.feedback = feedback;
    }
}

export class Question<StateT extends Elevated.Serializable> {
    reason: Markup.Markup;
    onValidate?: () => boolean;
    onSubmit?: () => void;
    onCancel?: () => void;

    constructor(args: {
        reason: Markup.Markup,
        onValidate?: () => boolean,
        onSubmit?: () => void,
        onCancel?: () => void
    }) {
        this.reason = args.reason;
        this.onValidate = args.onValidate;
        this.onSubmit = args.onSubmit;
        this.onCancel = args.onCancel;
    }

    answer(): StateT | null {
        return null;
    }
}

export interface Adornments {
    visible: boolean;
    editable: boolean;
    label: Markup.Markup ;
    cue?: Markup.Markup ;
    instruction?: Markup.Markup ;
    startIcon?: Markup.Markup ;
    endIcon?: Markup.Markup ;
}

export interface Interface<StateT extends Elevated.Serializable> {
    reset: () => void,
    ask: (question: Question<StateT>) => void,
    close: () => void,
    setState: (state: StateT) => void
    path: string[],
    isValid: boolean,
    title?: Markup.Markup,
    prologue?: Markup.Markup,
    epilogue?: Markup.Markup,
    fieldDecorator: (field: Field<StateT>) => Adornments,
    actionDecorator: (action: Action<StateT>) => Adornments, 
    actions: Action<StateT>[],
    status: Status,
    state?: StateT
}

export class Action<StateT extends Elevated.Serializable> {
    slug: string;
    onKeyPress?: (context: Interface<StateT>, event:any) => boolean;
    onClick: (context: Interface<StateT>) => void;
    insideLabel?: string;
    // startIcon?: JSX.Element;
    // endIcon?: JSX.Element;
    
    constructor(
        slug: string,
        onClick: (context: Interface<StateT>) => void,
        insideLabel?: string, 
        onKeyPress?: (context: Interface<StateT>, event:any) => boolean,
        // startIcon?: JSX.Element,
        // endIcon?: JSX.Element
    ){
        this.slug = slug;
        this.onClick = onClick;
        this.insideLabel = insideLabel;
        this.onKeyPress = onKeyPress;
        // this.startIcon = startIcon;
        // this.endIcon = endIcon;
    }
}

export class Field<StateT extends Elevated.Serializable> {
    slug: string;
    getValue: (context: Interface<StateT>) => any;
    setValue: (context: Interface<StateT>, newValue:any) => void;
    insideLabel?: string;
    
    constructor(
        slug: string,
        getValue: (context: Interface<StateT>) => any,
        setValue: (context: Interface<StateT>, newValue:any ) => void,
        insideLabel?: string, 
        // startIcon?: JSX.Element,
        // endIcon?: JSX.Element
    ){
        this.slug = slug;
        this.getValue = getValue;
        this.setValue = setValue;
        this.insideLabel = insideLabel;
        // this.startIcon = startIcon;
        // this.endIcon = endIcon;
    }
}

export function defaultDecorator<StateT extends Elevated.Serializable>(descriptor:Field<StateT>|Action<StateT>) {
    return { 
        visible: true,
        editable: true,
        label: new Markup.Header({ text: descriptor.slug })
    };
}

export class Form<StateT extends Elevated.Serializable> {
    initialState: () => StateT;
    initialStatus: () => Status;
    title: () => Markup.Markup;
    prologue: () => Markup.Markup;
    epilogue: () => Markup.Markup;
    validator: (state:StateT) => boolean;
    fieldDecorator: (descriptor: Field<StateT>) => Adornments;
    actionDecorator: (descriptor: Action<StateT>) => Adornments;
    actions: () => Action<StateT>[];

    constructor(args: {
        initialState: () => StateT;
        title: () => Markup.Markup;
        prologue: () => Markup.Markup;
        epilogue: () => Markup.Markup;
        validator?: (state:StateT) => boolean;
        fieldDecorator?: (descriptor: Field<StateT>) => Adornments,
        actionDecorator?: (descriptor: Action<StateT>) => Adornments,
        actions: () => Action<StateT>[]
    }) {
        this.initialState = args.initialState;
        this.initialStatus = () => Status.Reset;
        this.title = args.title;
        this.prologue = args.prologue;
        this.epilogue = args.epilogue;
        this.validator = args.validator || (() => true);
        this.fieldDecorator = args.fieldDecorator || defaultDecorator;
        this.actionDecorator = args.actionDecorator || defaultDecorator;
        this.actions = args.actions;
    }
}

export class Builder<ExpectedType extends Elevated.Serializable> implements Elevated.Visitor<ExpectedType> {
    obj?: ExpectedType;
    fields: Field<any>[] = [];

    beginObject(obj: ExpectedType): void { this.obj = obj; }
    endObject(obj: ExpectedType): void {}

    verbatim<DataType>(target: any, propName: string): void {
        this.fields = [ ... this.fields, 
            new Field<ExpectedType>(
                propName, 
                (context: Interface<ExpectedType>) => {
                    if(!context.state) {
                        return undefined;
                    } else {
                        const property = new Elevated.Property.Primitive<DataType>(context.state, propName);
                        return property.value;
                    }
                },
                (context: Interface<ExpectedType>, newValue: any) => {
                    if(context.state) {
                        const value = context.state.clone(context.state);
                        const property = new Elevated.Property.Primitive<DataType>(value, propName);
                        property.setValue(newValue);
                        context.setState(value);
                    }
                },
                propName
            )
        ];
    }

    primitive<PropType>(target: any, propName: string, fromString?: (initializer:string) => PropType): void {
        this.fields = [ ... this.fields, 
            new Field<ExpectedType>(
                propName, 
                (context: Interface<ExpectedType>, ) => {
                    if(!context.state) {
                        return undefined;
                    } else {
                        const property = new Elevated.Property.Primitive<PropType>(context.state, propName);
                        return property.value;
                    }
                },
                (context: Interface<ExpectedType>, newValue: PropType) => {
                    if(context.state) {
                        const value = context.state.clone(context.state);
                        const property = new Elevated.Property.Primitive<PropType>(value, propName);
                        property.setValue(newValue);
                        context.setState(value);
                    }
                },
                propName
            )
        ];
    }

    scalar<ObjectType extends Elevated.Serializable>(target: any, propName: string): void {
    }

    array<ElementType extends Elevated.Serializable>(target: any, propName: string): void {
    }

    build(target: ExpectedType): any {
        target.marshal(this);
    }
}
