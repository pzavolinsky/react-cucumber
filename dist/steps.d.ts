/// <reference types="cucumber" />
import { StepDefinitions } from 'cucumber';
import { Context } from './context';
import { MapCreateComponent, Render } from './render';
export interface StepArgs {
    ctx: Context;
    defs: StepDefinitions;
    render: Render;
}
export interface Options {
    mapCreateComponent?: MapCreateComponent;
}
export declare const createArgs: (defs: StepDefinitions, comps: any[], options: Options) => StepArgs;
export declare const givenRenderedComponent: ({ctx, defs, render}: StepArgs) => void;
export declare const givenFunction: ({ctx, defs}: StepArgs) => void;
export declare const givenVariable: ({ctx, defs}: StepArgs) => void;
export declare const whenRenderingComponent: ({ctx, defs, render}: StepArgs) => void;
export declare const whenTheSelectorCallsProp: ({ctx, defs}: StepArgs) => void;
export declare const whenTheSelectorChanges: ({ctx, defs}: StepArgs) => void;
export declare const thenDumpComponent: ({ctx, defs}: StepArgs) => void;
export declare const thenDumpContext: ({ctx, defs}: StepArgs) => void;
export declare const thenTheSelectorHasProp: ({ctx, defs}: StepArgs) => void;
export declare const thenThereAreSelectorElements: ({ctx, defs}: StepArgs) => void;
export declare const thenTheFunctionWasCalled: ({ctx, defs}: StepArgs) => void;
export declare const thenTheComponentChanged: ({ctx, defs}: StepArgs) => void;
export declare const thenTheComponentDidNotChange: ({ctx, defs}: StepArgs) => void;
export declare const thenTheFunctionCallWas: ({ctx, defs}: StepArgs) => void;
declare var _default: (({ctx, defs, render}: StepArgs) => void)[];
export default _default;
