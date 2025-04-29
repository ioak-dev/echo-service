import { SpecDefinition, ToolbarOption } from "../specs/types/spec.types";

export const exampleSpec: SpecDefinition = {
  fields: {
    fullName: {
      type: "string",
      required: true,
      validate: {
        minLength: 3,
        maxLength: 100,
        regex: "^[A-Za-z ]+$"
      },
      displayOptions: {
        label: "Full Name",
        labelDesc: "Lorem ipsum dolor sit",
        placeholder: "Enter full name",
        tooltip: "The full name of the person",
        type: "text"
      }
    },
    displayName: {
      type: "string",
      required: true,
      validate: {
        minLength: 3,
        maxLength: 100,
        regex: "^[A-Za-z ]+$"
      },
      displayOptions: {
        label: "Display Name",
        labelDesc: "Lorem ipsum dolor sit",
        placeholder: "Enter full name",
        tooltip: "The full name of the person",
        type: "h1"
      }
    },
    // description: {
    //   type: "string",
    //   required: true,
    //   displayOptions: {
    //     label: "Description",
    //     labelDesc: "Lorem ipsum dolor sit",
    //     placeholder: "Describe here",
    //     tooltip: "Lorem tooltip",
    //     type: "richtext",
    //     toolbarOptions: [
    //       ToolbarOption.Bold,
    //       ToolbarOption.Italic,
    //       ToolbarOption.Underline,
    //       ToolbarOption.AlignLeft,
    //       ToolbarOption.AlignCenter,
    //       ToolbarOption.AlignRight,
    //       ToolbarOption.AlignJustify,
    //       ToolbarOption.BulletList,
    //       ToolbarOption.Heading
    //     ]
    //   }
    // },
    categoryId: {
      type: "string",
      required: true,
      displayOptions: {
        label: "Category",
        labelDesc: "Lorem ipsum dolor sit",
        placeholder: "Choose a category",
        tooltip: "Classification",
        type: "autocomplete",
        optionsLookupKey: "category"
      }
    },
    age: {
      type: "number",
      validate: {
        min: 0,
        max: 120
      },
      displayOptions: {
        label: "Age",
        labelDesc: "Lorem ipsum dolor sit",
        placeholder: "Enter age",
        tooltip: "Age must be between 0 and 120",
        type: "number"
      }
    },
    numberSelect: {
      type: "number",
      displayOptions: {
        label: "Number selector",
        labelDesc: "Lorem ipsum dolor sit",
        placeholder: "Choose a number",
        tooltip: "tool tip for the number selector",
        type: "select",
        optionsLookupKey: "numberSelect"
      }
    },
    isActive: {
      type: "boolean",
      displayOptions: {
        label: "Active",
        labelDesc: "Lorem ipsum dolor sit",
        type: "checkbox"
      }
    },
    tags: {
      type: "array",
      itemType: "string",
      validate: {
        minItems: 1,
        maxItems: 10
      },
      displayOptions: {
        label: "Tags",
        labelDesc: "Lorem ipsum dolor sit",
        type: "autocomplete",
        tooltip: "Add at least one tag",
        optionsLookupKey: "tag"
      }
    },
    tagsFree: {
      type: "array",
      itemType: "string",
      validate: {
        minItems: 1,
        maxItems: 10
      },
      displayOptions: {
        label: "Tags free",
        labelDesc: "Lorem ipsum dolor sit",
        placeholder: "Type a tag name",
        type: "array",
        tooltip: "Add at least one tag",
        optionsLookupKey: "tag"
      }
    },
    contactInfo: {
      type: "object",
      displayOptions: {
        label: "Contact Information",
        labelDesc: "Lorem ipsum dolor sit",
        type: "group",
      },
      fields: {
        email: {
          type: "string",
          validate: {
            regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
          },
          displayOptions: {
            label: "Email",
            labelDesc: "Lorem ipsum dolor sit",
            placeholder: "Enter email",
            type: "text"
          }
        },
        phoneNumbers: {
          type: "array",
          itemType: "string",
          validate: {
            minItems: 1
          },
          displayOptions: {
            label: "Phone Numbers",
            labelDesc: "Lorem ipsum dolor sit",
            type: "array"
          }
        },
        preferences: {
          type: "array",
          itemType: "string",
          validate: {
            minItems: 1
          },
          displayOptions: {
            label: "Preferences",
            labelDesc: "Lorem ipsum dolor sit",
            type: "select",
            optionsLookupKey: "category"
          }
        },
        testarray: {
          type: "array",
          itemType: "object",
          validate: {
            minItems: 1
          },
          fields: {
            "headline":
            {
              type: "string", displayOptions: { type: "h2" }
            },
            "headlineParagraph":
            {
              type: "string", displayOptions: { type: "h6" }
            }
          },
          displayOptions: {
            label: "Test array",
            labelDesc: "Lorem ipsum dolor sit",
            type: "array"
          }
        }
      }
    },
    addresses: {
      type: "array",
      itemType: "object",
      displayOptions: {
        label: "Addresses",
        labelDesc: "Lorem ipsum dolor sit",
        type: "array",
      },
      fields: {
        street: {
          type: "string",
          displayOptions: {
            label: "Street",
            labelDesc: "Lorem ipsum dolor sit",
            type: "text"
          }
        },
        city: {
          type: "string",
          displayOptions: {
            label: "City",
            labelDesc: "Lorem ipsum dolor sit",
            type: "text"
          }
        },
        country: {
          type: "string",
          displayOptions: {
            label: "City",
            labelDesc: "Lorem ipsum dolor sit",
            type: "select",
            optionsLookupKey: "country"
          }
        },
        geo: {
          type: "object",
          displayOptions: {
            label: "Coordinates",
            labelDesc: "Lorem ipsum dolor sit",
            type: "group",
          },
          fields: {
            lat: {
              type: "number",
              displayOptions: {
                label: "Latitude",
                labelDesc: "Lorem ipsum dolor sit",
                type: "number"
              }
            },
            lng: {
              type: "number",
              displayOptions: {
                label: "Longitude",
                labelDesc: "Lorem ipsum dolor sit",
                type: "number"
              }
            }
          }
        }
      }
    },
    preferences: {
      type: "enum",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "SMS", value: "sms" }
      ],
      displayOptions: {
        label: "Preferred Contact Method",
        type: "radio-group"
      }
    },
    family: {
      type: "array",
      itemType: "object",
      displayOptions: {
        label: "Family Members",
        labelDesc: "Lorem ipsum dolor sit",
        type: "array",
      },
      fields: {
        name: {
          type: "string",
          displayOptions: {
            label: "Name",
            labelDesc: "Lorem ipsum dolor sit",
            type: "text"
          }
        },
        relation: {
          type: "enum",
          options: [
            { label: "Parent", value: "parent" },
            { label: "Sibling", value: "sibling" },
            { label: "Child", value: "child" }
          ],
          displayOptions: {
            label: "Relation",
            labelDesc: "Lorem ipsum dolor sit",
            type: "select"
          }
        },
        address: {
          type: "object",
          displayOptions: {
            label: "Address",
            labelDesc: "Lorem ipsum dolor sit",
            type: "group",
          },
          fields: {
            street: {
              type: "string",
              displayOptions: {
                label: "Street",
                labelDesc: "Lorem ipsum dolor sit",
                type: "text"
              }
            },
            city: {
              type: "string",
              displayOptions: {
                label: "City",
                labelDesc: "Lorem ipsum dolor sit",
                type: "text"
              }
            }
          }
        }
      }
    }
  }
}