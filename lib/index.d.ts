declare class Pin {
    name: string;
    component: Component;
    direction: string;
    constructor(component: any, name: any);
}
declare class Component {
    name: string;
    pins: Array<Pin>;
    pin1: Pin;
    pin2: Pin;
    value: string;
    constructor(description: any);
    copy(): any;
    equals(other: any): boolean;
}
declare class Resistor extends Component {
    constructor(description: any);
}
declare class Capacitor extends Component {
    constructor(description: any);
}
declare class Label {
    name: string;
    direction: string;
    constructor();
}
declare class Power extends Label {
    constructor();
}
declare class Ground extends Label {
    constructor();
}
declare class Input extends Label {
    constructor();
}
declare class Output extends Label {
    constructor();
}
declare class Circuit {
    name: string;
    components: Array<Component>;
    labels: Array<Label>;
    nets: Array<Array<Pin | Label>>;
    subcircuits: Array<Circuit>;
    constructor();
    chain(elements: any): void;
    connect(elements: any): void;
    _connect(one: any, two: any): void;
    _add(x: any): void;
    toYosys(): {
        modules: {
            [x: string]: {
                ports: {};
                cells: {};
            };
        };
    };
}
export { Capacitor, Resistor, Circuit, Label, Power, Ground, Output, Input, };
