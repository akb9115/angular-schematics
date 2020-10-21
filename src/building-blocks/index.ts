
import { Rule, SchematicContext, Tree, mergeWith, template, apply, url, move, branchAndMerge, chain } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getProject } from '@schematics/angular/utility/project';
import { addDynamicBlocksToNgModule } from '../utils/dynamic-blocks-injector';
import { findModuleFromOptions } from '../schematics-angular-utils/find-building-block-module';
import { addPackageJsonDependency, NodeDependencyType, NodeDependency } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '~8.2.14', name: '@angular/forms' },
      { type: NodeDependencyType.Default, version: '~8.2.14', name: '@angular/common' }
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });
    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing required packages...`);
    return host;
  };
}


export function buildingBlocks(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    if (_options.path == '') {
      throw new Error("Invalid Path!")
    }

    const workspace = getWorkspace(tree);
    const projectName = Object.keys(workspace.projects)[0];
    const project = getProject(workspace, projectName);

    _options["name"] = "DynamicForm"
    _options["project"] = projectName

    if (_options.path == "y" || _options.path == 'Y') {

      if (project.sourceRoot) {
        _options.path = project.sourceRoot.toString() + '/' + project.prefix.toString()
        let module = findModuleFromOptions(tree, _options);
        _options["module"] = module
      }

    }
    else if (_options.path !== undefined) {

      if (project.sourceRoot) {
        _options.path = project.sourceRoot.toString() + '/' + project.prefix.toString() + '/' + _options.path
        let module = findModuleFromOptions(tree, _options);
        _options["module"] = module
      }

    }

    _options["skipImport"] = false
    _options["components_name"] = ["DynamicForm", "DynamicElements", "DynamicFieldDirective"]
    _options["required_modules"]=["FormsModule","ReactiveFormsModule"]

    const sourceTemplates = url('./files');
    const sourceParametrizedTemplate = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings,
      }),
      move(_options.path)
    ])

    const rule = chain([
      (branchAndMerge(chain([
        mergeWith(sourceParametrizedTemplate),
        addDynamicBlocksToNgModule(_options, true),
        addPackageJsonDependencies(),
        installPackageJsonDependencies()
      ]))),
    ]);

    return rule;

  };

}
