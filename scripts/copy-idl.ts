import fse from 'fs-extra'
import path from 'path'

// inputs
const idlDir = path.resolve(__dirname, '../target/idl')
const typesDir = path.resolve(__dirname, '../target/types')

// outputs
const appDir = path.resolve(__dirname, '../app/src')

async function copyDir(from: string, to: string) {
    const files = await fse.readdir(from)
    for (const file of files) {
        const fromFile = path.resolve(from, file)
        const toFile = path.resolve(to, file)
        await fse.copy(fromFile, toFile)
    }
}

const promises = [
    copyDir(idlDir, appDir + '/idl'),
    copyDir(typesDir, appDir + '/types'),
]

promises.forEach(p => p.catch(console.error))