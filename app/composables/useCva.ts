type Variants = Record<string, Record<string, string>>;
type VariantProps = Record<string, string | boolean | undefined | null>;

interface CompoundVariant {
  [key: string]: string | boolean | undefined | null;
  class: string;
}

// Helper to create variant classes for Vue components (inspired by class-variance-authority)
export function useCva(
  props: VariantProps, 
  base: string, 
  variants: Variants, 
  compoundVariants: CompoundVariant[] = []
): ComputedRef<string> {
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

    const compoundClasses = compoundVariants
      .filter((cv) => {
        return Object.entries(cv).every(([key, value]) => {
          if (key === 'class') return true;
          return props[key] === value;
        });
      })
      .map((cv) => cv.class);

    return [base, ...variantClasses, ...compoundClasses].join(' ');
  });
}
