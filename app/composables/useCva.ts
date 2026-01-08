type Variants = Record<string, Record<string, string>>;
type VariantProps = Record<string, string | boolean | undefined | null>;

// Helper to create variant classes for Vue components (inspired by class-variance-authority)
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
