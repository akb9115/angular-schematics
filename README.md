# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

# Running these dynamic form schematics from an Angular CLI project

To use these schematics from an angular project use the command:

(a) To create dynamic building blocks 
`schematics ../../angular-schematics-tryouts/src/collection.json:building-blocks --debug=false`

(b) To create a dynamic login component which is gonna use the dynamic building blocks, use the command:
`schematics ../../angular-schematics-tryouts/src/collection.json:generate-form login --debug=false`

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 