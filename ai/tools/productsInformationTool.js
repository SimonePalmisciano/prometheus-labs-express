import { z } from "zod";
import { tool } from "langchain";
import { connection } from "../../data/db.js";
import queries from "../../utils_js/queries/queries.js"

async function fetchProductInformation() {
    const [rows] = await connection.execute(queries.querySelectAllProducts); 
    const rowsJSON = JSON.stringify(rows);
    return rowsJSON;
};

const toolDefinition = {
    name: "product_information",
    description: `Primary source of truth for all product information. Always use this tool whenever the user's request involves products, recommendations, ingredients, benefits, categories, usage, comparisons or any product-related question. The tool returns complete and up-to-date information for each product, including name, category, benefits, powers, ingredients, usage instructions and other consumer-facing details. Use it to verify facts before answering, recommend the most suitable product based on the user's needs, compare products and avoid relying on internal knowledge. When a product may be relevant, prefer calling this tool before generating a response.`,
    schema: z.object({
        query: z.string().describe("The user's free-text request, keywords, or the primary topic of the conversation. This input is used to search the product database for the most relevant information.")
    })
}

const productsInformationTool = tool(fetchProductInformation, toolDefinition);

export { productsInformationTool };

