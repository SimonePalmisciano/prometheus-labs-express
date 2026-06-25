/** Una funzione per eliminare i duplicati dai risultati di ricerca, raggruppando per ciascun oggetto lélemento multiplo a sua volta in un array*/

function groupBy(array) {
    if (!array || array.length === 0) return [];

    // sort dell'array per non spaccare il for
    // localeSort() è un JS method per ordine alfabetico
    const sortedArray = [...array].sort((a, b) => a.slug.localeCompare(b.slug));

    const resultArray = [];

    let lastEl = null; // ultimo elemento visto nel ciclo
    let groups = []; // tutte le row di prodotto uniche

    for (let i = 0; i < sortedArray.length; i++) {
        const currentEl = sortedArray[i];

        if (i === 0) {
            lastEl = currentEl;
            groups = [lastEl];
        } else {

            if (currentEl.slug === lastEl.slug) {
                groups.push(currentEl);
            } else {
                const firstGroup = groups[0];
                const categories = groups.map(row => {
                    return row.category;
                });

                const finalObj = {
                    ...firstGroup,
                    categories
                };

                delete finalObj.category;

                resultArray.push(finalObj);

                lastEl = currentEl;
                groups = [lastEl];
            }

        }

    }

    // per gestire prodotto con 1 sola category
    if (groups.length > 0) {
        const firstGroup = groups[0];
        const categories = groups.map(row => {
            return row.category;
        });

        const finalObj = {
            ...firstGroup,
            categories
        };

        delete finalObj.category;

        resultArray.push(finalObj);
    }

    return resultArray;

}

// funzione per creare rows nel mailer

const generateTableRows = (items) => {
    return items.map(item => {
        const subtotal = item.quantity * item.price_at_purchase;
        return `
        <tr>
            <td style="border: 1px solid #e2e8f0; padding: 12px 10px; text-align: left; color: #4a5568; font-size: 14px;">${item.slug}</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px 10px; text-align: center; color: #4a5568; font-size: 14px;">${item.quantity}</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px 10px; text-align: right; color: #4a5568; font-size: 14px;">€${Number(item.price_at_purchase).toFixed(2)}</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px 10px; text-align: right; color: #1a202c; font-weight: bold; font-size: 14px;">€${subtotal.toFixed(2)}</td>
        </tr>
        `;
    }).join('');
};

const utils = {
    groupBy,
    generateTableRows
};

export default utils;