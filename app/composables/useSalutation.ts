import type { Contact } from '#shared/schemas/contact.schema';

type NameFormat = 'full' | 'short' | 'lastname';

interface SalutationOptions {
  format?: NameFormat;
  multiple?: 'generic' | 'individual'; // Removed 'grouped'
}

export const useSalutation = () => {
  const formatName = (contact: Contact, format: NameFormat = 'full'): string => {
    const lastName = contact.name.split(' ').pop() || '';
    const firstName = contact.name.split(' ').slice(0, -1).join(' ');

    switch (format) {
      case 'full':
        return contact.name;
      case 'short':
        return `${firstName.charAt(0)}. ${lastName}`;
      case 'lastname':
        return lastName;
    }
  };

  const getSalutation = (contacts: Contact[] | undefined, options: SalutationOptions = {}): string => {
    const { format = 'full', multiple = 'individual' } = options;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return 'Sehr geehrte Damen und Herren';
    }

    if (contacts.length === 1) {
      const contact = contacts[0]!;
      const formattedName = formatName(contact, format);

      switch (contact.salutation) {
        case 'male':
          return `Sehr geehrter Herr ${formattedName}`;
        case 'female':
          return `Sehr geehrte Frau ${formattedName}`;
        default:
          return `Sehr geehrte/r ${contact.name}`;
      }
    }
    
    if (multiple === 'generic') {
      return 'Sehr geehrte Damen und Herren';
    }

    // Always use individual style for multiple contacts if not generic
    const salutations = contacts.map(contact => {
      const formattedName = formatName(contact, format);
      switch (contact.salutation) {
        case 'male':
          return `sehr geehrter Herr ${formattedName}`;
        case 'female':
          return `sehr geehrte Frau ${formattedName}`;
        default:
          return formattedName;
      }
    });

    // Join with 'und' for the last element
    let salutationString: string;
    const lastSalutation = salutations.pop();

    if (salutations.length > 0) {
        salutationString = `${salutations.join(', ')} und ${lastSalutation}`;
    } else {
        salutationString = lastSalutation || '';
    }

    return salutationString.charAt(0).toUpperCase() + salutationString.slice(1);
  };

  return {
    getSalutation,
    formatName,
  };
};
