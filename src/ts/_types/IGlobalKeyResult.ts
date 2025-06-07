/**
 * Return value from KeyListener. You can either return true/false.
 * Returning `True` will halt propagation of the key event to other processes. `False` will allow events to propagate to the rest of the system.
 * If you want to halt propagation within LaunchMenu you can also return an object containing `stopImmediatePropagation:true`.
 */
export type IGlobalKeyResult =
  | boolean
  | undefined
  | {
      /** True - stops propagation to other remote processes. False - allow propagation to other remote processes */
      stopPropagation?: boolean;
      /** True - stops propagation of event within key server. False - allow propagation of events within the keyserver */
      stopImmediatePropagation?: boolean;
    };
