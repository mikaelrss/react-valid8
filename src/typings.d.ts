/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
import { ComponentType, UIEventHandler } from "react";
import { IProps, UtilFunctions } from "./validate/Form";
import { IInjectProps } from "./validate/ErrorInput";

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module "*.svg" {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}

declare const Form: ComponentType<IProps>;

declare const UtilFunctions: UtilFunctions;

export default Form;
