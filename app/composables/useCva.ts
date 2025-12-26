type Variants = Record<string, Record<string, string>>;
type VariantProps = Record<string, string | boolean | undefined | null>;

/**
 * A composable for creating variant classes for Vue components.
 * Inspired by class-variance-authority.
 *
 * @param props - The component's props object containing the variant keys.
 * @param base - The base class string.
 * @param variants - An object defining the variant groups and their classes.
 * @returns A computed property that returns the final class string.
 */
export function useCva(props: VariantProps, base: string, variants: Variants): ComputedRef<string> {
  return computed(() => {
    const variantClasses = Object.entries(variants)
      .map(([variantName, variantOptions]) => {
        const propValue = props[variantName];
        if (propValue !== undefined && propValue !== null) {
          const propValueAsString = String(propValue);
          if (Object.prototype.hasOwnProperty.call(variantOptions, propValueAsString)) {
            return variantOptions[propValueAsString];
          }
        }
        return '';
      })
      .filter(Boolean);

    return [base, ...variantClasses].join(' ');
  });
}
