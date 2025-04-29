import { SpecDefinition } from "../specs/types/spec.types";

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
        displayOptions: {
          label: "Full Name",
          placeholder: "Enter full name",
          tooltip: "The full name of the person",
          type: "text"
        }
      },
      age: {
        type: 'number',
        validate: {
          min: 0,
          max: 120
        },
        displayOptions: {
          label: "Age",
          placeholder: "Enter age",
          tooltip: "Age must be between 0 and 120",
          type: "number"
        }
      },
      isActive: {
        type: 'boolean',
        displayOptions: {
          label: "Active",
          type: "checkbox"
        }
      },
      tags: {
        type: 'array',
        itemType: 'string',
        validate: {
          minItems: 1,
          maxItems: 10
        },
        displayOptions: {
          label: "Tags",
          type: "autocomplete",
          tooltip: "Add at least one tag"
        }
      },
      contactInfo: {
        type: 'object',
        displayOptions: {
          label: "Contact Information",
          type: "group"
        },
        fields: {
          email: {
            type: 'string',
            validate: {
              regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
            },
            displayOptions: {
              label: "Email",
              placeholder: "Enter email",
              type: "text"
            }
          },
          phoneNumbers: {
            type: 'array',
            itemType: 'string',
            validate: {
              minItems: 1
            },
            displayOptions: {
              label: "Phone Numbers",
              type: "select"
            }
          }
        }
      },
      addresses: {
        type: 'array',
        itemType: 'object',
        displayOptions: {
          label: "Addresses",
          type: "group-array"
        },
        fields: {
          street: {
            type: 'string',
            displayOptions: {
              label: "Street",
              type: "text"
            }
          },
          city: {
            type: 'string',
            displayOptions: {
              label: "City",
              type: "text"
            }
          },
          geo: {
            type: 'object',
            displayOptions: {
              label: "Coordinates",
              type: "group"
            },
            fields: {
              lat: {
                type: 'number',
                displayOptions: {
                  label: "Latitude",
                  type: "number"
                }
              },
              lng: {
                type: 'number',
                displayOptions: {
                  label: "Longitude",
                  type: "number"
                }
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
        displayOptions: {
          label: "Preferred Contact Method",
          type: "radio-group"
        }
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
  