
// Option A: Directly referencing the private APIs
// import { ModuleOptions, buildRelativePath } from "@schematics/angular/utility/find-module";
// import { Rule, Tree, SchematicsException } from "@angular-devkit/schematics";
// import { dasherize, classify } from "@angular-devkit/core";
// import { addDeclarationToModule, addExportToModule } from "@schematics/angular/utility/ast-utils";
// import { InsertChange } from "@schematics/angular/utility/change";

// Option B: Using a fork of the private APIs b/c they can change

import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;

// Referencing forked and copied private APIs 
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import { addDeclarationToModule, addExportToModule } from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

const stringUtils = { dasherize, classify };

export function addDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    if (exports) {
      addExport(host, options);
    }
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {

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

  if (options.name=="DynamicForm" || options.name=="DynamicFieldElements"){

    const componentPath = `${options.path}/`;

    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Component`);    

  }

  else{

    const componentPath = `${options.path}/`
    + stringUtils.dasherize(options.name) + '/'
    + stringUtils.dasherize(options.name)
    + '.component';

    result.relativePath = buildRelativePath(options.module, componentPath);
    result.classifiedName = stringUtils.classify(`${options.name}Component`);

  }
  return result;

}

function addDeclaration(host: Tree, options: ModuleOptions) {

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

  // let options2={ name: 'DynamicForm',
  // project: options["project"],
  // path: options["path"]+"/dynamic-building-blocks/core-components/dynamic-form/dynamic-form.component",
  // module: options.module,
  // export: false }
  // const context2 = createAddToModuleContext(host, options2);
  // const modulePath2 = options.module || '';

  // const declarationChanges2 = addDeclarationToModule(context2.source,
  //   modulePath2,
  //     context2.classifiedName,
  //     context2.relativePath);

  // const declarationRecorder2 = host.beginUpdate(modulePath2);
  // for (const change of declarationChanges2) {
  //   if (change instanceof InsertChange) {
  //     declarationRecorder2.insertLeft(change.pos, change.toAdd);
  //   }
  // }
  // host.commitUpdate(declarationRecorder2);

};

function addExport(host: Tree, options: ModuleOptions) {
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const exportChanges = addExportToModule(context.source,
      modulePath,
      context.classifiedName,
      context.relativePath);

  const exportRecorder = host.beginUpdate(modulePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(exportRecorder);
};