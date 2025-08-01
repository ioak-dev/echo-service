export const customerSupportSpec: RAGDataSchema = {
    ragId: "customer-support",
    primaryTable: {
        tableName: "support_tickets",
        idColumnName: "reference",
        embedColumns: ["issue", "created_at", "status", "customer_id"],
        metadataColumns: ["_id", { field: "created_at", alias: "ticket_date" }],
        relatedTables: [
            {
                tableName: "customers",
                idColumnName: "reference",
                parentColumn: "customer_id",
                childColumn: "reference",
                embedColumns: ["name", "email"],
            },
            {
                tableName: "orders",
                idColumnName: "reference",
                parentColumn: "customer_id",
                childColumn: "customer_id",
                embedColumns: ["reference", "order_date", "status"],
                // doNotEmbed: true,
                relatedTables: [
                    {
                        tableName: "order_items",
                        idColumnName: "reference",
                        parentColumn: "reference",
                        childColumn: "order_id",
                        embedColumns: ["product_id", "quantity", "price", "object"],
                        relatedTables: [
                            {
                                tableName: "products",
                                idColumnName: "reference",
                                parentColumn: "product_id",
                                childColumn: "reference",
                                embedColumns: ["name", "description"],
                            }
                        ]
                    }
                ]
            }
        ],
        // embeddingTemplate: `
        // ### Support Ticket Summary
        
        // Ticket Reference: {{reference}}
        // Status: {{status}}
        // Issue: {{issue}}
        // Created On: {{created_at}}
        
        // {{#if __relatedData.customers}}
        // {{#each __relatedData.customers}}
        // ### Customer Information
        // Name: {{name}}
        // Email: {{email}}
        // {{/each}}
        // {{/if}}

        // {{#if __relatedData.orders}}
        // ### Orders
        // {{#each __relatedData.orders}}
        // - Order Reference: {{reference}}
        //   - Order Date: {{order_date}}
        //   - Order Status: {{status}}
        
        //   {{#if __relatedData.order_items}}
        //   #### Order Items
        //   {{#each __relatedData.order_items}}
        //   - Product: {{#if __relatedData.products}}{{#each __relatedData.products}}{{name}}{{/each}}{{else}}ID {{product_id}}{{/if}}
        //     - Quantity: {{quantity}}
        //     - Price: {{price}}
        //     - Obj: {{object.fieldone}}
        //   {{/each}}
        //   {{/if}}
        // {{/each}}
        // {{/if}}
        // `
    },
    globalSettings: {
        chunkSeparator: "\n",
        // maxChunkSize: 800
    }
};

export const salesReportingSpec: RAGDataSchema = {
    ragId: "sales-reporting",
    primaryTable: {
        tableName: "orders",
        idColumnName: "_id",
        embedColumns: ["order_date", "status"],
        metadataColumns: ["_id", "order_date"],
        relatedTables: [
            {
                tableName: "customers",
                idColumnName: "_id",
                parentColumn: "customer_id",
                childColumn: "_id",
                embedColumns: ["name", "email"]
            },
            {
                tableName: "order_items",
                idColumnName: "_id",
                parentColumn: "_id",
                childColumn: "order_id",
                embedColumns: ["quantity", "price"],
                relatedTables: [
                    {
                        tableName: "products",
                        idColumnName: "_id",
                        parentColumn: "product_id",
                        childColumn: "_id",
                        embedColumns: ["name", "description"]
                    }
                ]
            }
        ],
        embeddingTemplate: `
      Order #{{id}} by {{customers.name}} on {{order_date}} (Status: {{status}}).
      Items purchased: {{#each order_items}} {{products.name}} x{{quantity}} @ \${{price}}; {{/each}}
    `
    },
    globalSettings: {
        chunkSeparator: "\n\n",
        maxChunkSize: 600
    }
};

export const fragmentRag: RAGDataSchema = {
    ragId: "fragment",
    primaryTable: {
        tableName: "fragment",
        idColumnName: "reference",
        embedColumns: ["name", "content", "summary"],
        metadataColumns: ["_id"],
        // embeddingTemplate: "--",
        relatedTables: [
            {
                tableName: "fragmentInsight",
                idColumnName: "reference",
                parentColumn: "reference",
                childColumn: "fragmentReference",
                embedColumns: ["userInput", "response"],
                metadataColumns: ["mode"],
            }
        ]
    },
    globalSettings: {
        maxChunkSize: 1000,
        chunkSeparator: "."
    }

}


export const fragmentRAGSchema: RAGDataSchema = {
    ragId: "fragment-context",
    primaryTable: {
        tableName: "fragment",
        idColumnName: "reference",
        embedColumns: ["name", "content", "summary"],
        metadataColumns: ["labels"],
        embeddingTemplate: `
      Fragment Name: {{name}}
      Summary: {{summary}}
      Content: {{content}}
    `,
        relatedTables: [
            {
                tableName: "fragmentInsight",
                idColumnName: "reference",
                embedColumns: ["mode", "userInput", "response"],
                metadataColumns: ["mode"],
                parentColumn: "reference",
                childColumn: "fragmentReference",
                embeddingTemplate: `
          Insight ({{mode}}):
          Input: {{userInput}}
          Response: {{response}}
        `,
            }
        ]
    },
    globalSettings: {
        chunkSeparator: "\n\n",
        maxChunkSize: 1000
    }
};
