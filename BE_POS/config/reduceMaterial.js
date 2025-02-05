const fs = require('fs');
const path = require('path');


const reduceMaterials = (dessicion) => {
    if (typeof dessicion !== 'boolean') {
        throw new Error('decision harus bertipe boolean');
    }

    const materialPath = path.join(__dirname, '../setting/material.json');
    const material = JSON.parse(fs.readFileSync(materialPath, 'utf-8'));

    material.autoReduction = dessicion;
    fs.writeFileSync(materialPath, JSON.stringify(material, null, 2));

    return material;
}


module.exports = { reduceMaterials };
