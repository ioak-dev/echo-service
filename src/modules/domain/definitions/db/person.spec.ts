import { SpecDefinition } from "../../specs/types/spec.types";

export const personProfileSpec: SpecDefinition = {
  fields: {
    fullName: {
      type: 'string',
      required: true,
      validate: {
        minLength: 3,
        maxLength: 100,
        regex: "^[A-Za-z ]+$"
      },
    },
    age: {
      type: 'number',
      validate: {
        min: 0,
        max: 120
      },
    },
    isActive: {
      type: 'boolean',
    },
    tags: {
      type: 'array',
      itemType: 'string',
      validate: {
        minItems: 1,
        maxItems: 10
      },
    },
    contactInfo: {
      type: 'object',
      fields: {
        email: {
          type: 'string',
          validate: {
            regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
          },
        },
        phoneNumbers: {
          type: 'array',
          itemType: 'string',
          validate: {
            minItems: 1
          },
        }
      }
    },
    addresses: {
      type: 'array',
      itemType: 'object',
      fields: {
        street: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        geo: {
          type: 'object',
          fields: {
            lat: {
              type: 'number',
            },
            lng: {
              type: 'number',
            }
          }
        }
      }
    },
    preferences: {
      type: 'enum',
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "SMS", value: "sms" }
      ],
    }
  },
  meta: {
    hooks: {
      validate: async (doc, context) => {
        const errors: string[] = [];
        if (!doc.fullName || doc.fullName.length < 3) {
          errors.push("Full name must be at least 3 characters long.");
        }
        return errors;
      }
    },
    children: [
      {
        domain: "notes",
        field: { parent: "id", child: "ownerId" },
        cascadeDelete: true
      }
    ]
  }
};
