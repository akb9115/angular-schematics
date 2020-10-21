import { chain, mergeWith } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { apply, filter, move, Rule, template, url, branchAndMerge, Tree, SchematicContext } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addDeclarationToNgModule } from '../utils/ng-module-utils';
import { findModuleFromOptions } from '../schematics-angular-utils/find-module';
import { getWorkspace } from '../schematics-angular-utils/config';
import { parseName } from '../utils/parse-name';

function filterTemplates(_options: Schema): Rule {
  if (!_options.menuService) {
    return filter(path => !path.match(/\.service\.ts$/) && !path.match(/-item\.ts$/) && !path.match(/\.bak$/));
  }
  return filter(path => !path.match(/\.bak$/));
}

export function generateForm(_options: any): Rule {
  return (host: Tree, context: SchematicContext) => {

    const workspace = getWorkspace(host);
    if (!_options.project) {
      _options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[_options.project];

    if (_options.path === undefined) {
      const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
      _options.path = `/${project.root}/src/${projectDirName}`;
    }

    _options.module = findModuleFromOptions(host, _options);

    const parsedPath = parseName(_options.path, _options.name);
    _options.name = parsedPath.name;
    _options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      filterTemplates(_options),
      template({
        ...strings,
        ..._options
      }),
      move(parsedPath.path)
    ]);


    const rule = chain([
      (branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(_options, _options.export)
      ]))),
    ]);

    return rule(host, context);
  }
}
