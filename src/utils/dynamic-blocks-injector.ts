

import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;

// Referencing forked and copied private APIs 
import { buildRelativePath } from '../schematics-angular-utils/find-module';
import { addDeclarationToModule, addImportToModule } from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

const stringUtils = { dasherize, classify };

export function addDynamicBlocksToNgModule(options: any, exports: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    if (exports) {
      // addExport(host, options);
    }
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: any): AddToModuleContext {

  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist!`);
  }
  const sourceText = text.toString('utf-8');

  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);

  if (options.name == "DynamicForm") {

    const componentPath = `/${options.path}/dynamic-building-blocks/dynamic-form/dynamic-form.component`;

    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Component`);

  }

  else if (options.name == "DynamicElements") {

    const componentPath = `/${options.path}/dynamic-building-blocks/modules/dynamic-elements.module`;

    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Module`);

  }

  else if (options.name == "DynamicFieldDirective") {
    const componentPath = `/${options.path}/dynamic-building-blocks/dynamicFieldDirective/dynamic-field.directive`;

    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}`);
  }

  else if(options.name == "FormsModule" || options.name == "ReactiveFormsModule"){
    const componentPath = `@angular/forms`;

    result.relativePath = componentPath
    result.classifiedName = stringUtils.classify(`${options.name}`);
  }

  else {

    const componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name) + '/'
      + stringUtils.dasherize(options.name)
      + '.component';

    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Component`);

  }
  return result;

}

function addDeclaration(host: Tree, options: any) {

  let comps_name = options["components_name"]
  let len = comps_name.length
  addRequiredImports(host, options)

  for (let i = 0; i < len; i++) {
    options["name"] = comps_name[i]
    if (options["name"] === "DynamicElements") {
      const context = createAddToModuleContext(host, options);
      const modulePath = options.module || '';
      const declarationChanges = addImportToModule(context.source,
        modulePath,
        context.classifiedName,
        context.relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }
    else {
      const context = createAddToModuleContext(host, options);
      const modulePath = options.module || '';
      const declarationChanges = addDeclarationToModule(context.source,
        modulePath,
        context.classifiedName,
        context.relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }
  }

};

// function addEntryComponents(host: Tree, options: any) {
//   const context = createAddToModuleContext(host, options);
//   const modulePath = options.module || '';

//   const exportChanges = addEntryComponentsToModule(context.source,
//     modulePath,
//     context.classifiedName,
//     context.relativePath);

//   const exportRecorder = host.beginUpdate(modulePath);

//   for (const change of exportChanges) {
//     if (change instanceof InsertChange) {
//       exportRecorder.insertLeft(change.pos, change.toAdd);
//     }
//   }
//   host.commitUpdate(exportRecorder);
// };

function addRequiredImports(host: Tree, options: any) {

  let reqd_imports = options["required_modules"]
  let len = reqd_imports.length

  for (let i = 0; i < len; i++) {
    options["name"]=reqd_imports[i]
    const context = createAddToModuleContext(host, options);
    const modulePath = options.module || '';
    const declarationChanges = addImportToModule(context.source,
      modulePath,
      context.classifiedName,
      context.relativePath);

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);
  }
}
