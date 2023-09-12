import { ComponentType } from 'react';
import { AnyComponent, ComponentsState, PiralPlugin, withApi } from 'piral-core';

type GenericComponents<T> = Partial<
  {
    [P in keyof T]: T[P] extends ComponentType<infer C> ? AnyComponent<C> : T[P];
  }
>;

interface LayoutApi {
  setLayout(components: GenericComponents<ComponentsState>, errorComponents: GenericComponents<ComponentsState>): void;
}

/**
 * Plugin function to allow Layouts to be set by Pilets. 
 */
export function createLayoutApi(): PiralPlugin<LayoutApi> {
  return (context) => (api) => ({
    setLayout(newComponents, newErrors) {
      context.dispatch((state) => {
        const components = {
          ...state.components,
        };
        const errorComponents = {
          ...state.errorComponents
        }
        for (const name of Object.keys(newComponents)) {
          components[name] = withApi(context, newComponents[name], api, 'unknown');
        }
        for (const name of Object.keys(newErrors)) {
          errorComponents[name] = withApi(context, newErrors[name], api, 'unknown');
        }

        return {
          ...state,
          components,
          errorComponents,
        };
      });
    },
  });
}