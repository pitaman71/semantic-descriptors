#!/usr/bin/env python3
from __future__ import annotations

import sys
import os
import yaml
import json
import re

from yaml.composer import Composer
from yaml.constructor import Constructor

class Definitions:
    name: str
    defns: dict
    children: dict

    def __init__(self, name = None):
        self.name = name
        self.defns = dict()
        self.children = dict()

    def __getitem__(self, key):
        return self.defns[key]

    def __setitem__(self, key, value):
        self.defns[key] = value

    def get_path(self, path):
        if len(path) == 0:
            return self
        if path[0] not in self.children:
            self.children[path[0]] = Definitions(path[0])
        return self.children[path[0]].get_path(path[1:])

    def make(self, result, indent_level = 0):
        if self.name is not None:
            result.append('')
            result.append('  '*indent_level+f"class {self.name}:")
            indent_level += 1
        for defn_name, defn_line in self.defns.items():
            result.append('  '*indent_level + defn_name + ' = ' + defn_line)

        for child_name, child in self.children.items():
            child.make(result, indent_level)

def read_yaml_with_line_numbers(file, src):
    loader = yaml.Loader(fp)
    def compose_node(parent, index):
        # the line number where the previous token has ended (plus empty lines)
        line = loader.line
        node = Composer.compose_node(loader, parent, index)
        node.__file__ = file
        node.__line__ = line + 1
        return node
    def construct_mapping(node, deep=False):
        mapping = Constructor.construct_mapping(loader, node, deep=deep)
        mapping['__file__'] = file
        mapping['__line__'] = node.__line__
        return mapping
    loader.compose_node = compose_node
    loader.construct_mapping = construct_mapping
    return loader.get_single_data()

assets = dict()
for yaml_model_path in sys.argv[1:]:
    asset_name = os.path.split(re.sub(r'\.yaml$', '', yaml_model_path))[1]
    assets[asset_name] = dict()
    with open(yaml_model_path, 'rt') as fp:
        models = read_yaml_with_line_numbers(yaml_model_path, fp)
        for model in models:
            if 'define' not in model:
                sys.stderr.write(f'Required top-level property define is not present in {model}\n')
            else:
                match = re.match(r'(\S+)\s*"(\S+)"', model['define'])
                if match:
                    defn_name = match.group(2)
                    parsed = {
                        'name': defn_name,
                        '@class': match.group(1)
                    }
                    for key, value in model.items():
                        if key != 'define':
                            parsed[key] = value
                    assets[asset_name][defn_name] = parsed

root = Definitions()

for asset_name, asset in assets.items():
    for defn_name, model in asset.items():
        #print(f'DEBUG: defined asset {asset_name} model {defn_name} as {json.dumps(model)}')
        if model['@class'] == 'Subject':
            path = [asset_name] + model['name'].split('.')
            defn = root.get_path(path[:-1])
            defn[path[-1]] = f"definitions.{model['@class']}.Builder().done()"
        elif model['@class'] == 'Measure':
            path = [asset_name] + model['name'].split('.')
            defn = root.get_path(path[:-1])
            body = f"definitions.{model['@class']}.Builder()"
            if 'of' not in model:
                raise RuntimeError(f"Required property of is missing from {model}")
            if 'measures' not in model:
                raise RuntimeError(f"Required property measures is missing from {model}")
            for key, value in model['of'].items():
                if key not in ('__file__','__line__'):
                    if not isinstance(value, list):
                        value = [value]
                    body += ".of("
                    body += ', '.join([ "'"+key+"'"] + value)
                    body += ")"
            for key, value in model['measures'].items():
                if key not in ('__file__','__line__'):
                    if not isinstance(value, list):
                        value = [value]
                    body += ".measures("
                    body += ', '.join([ "'"+key+"'"] + value)
                    body += ")"
            body += '.done()'
            defn[path[-1]] = body
        else:
            try:
                path = [asset_name] + model['name'].split('.')
                defn = root.get_path(path[:-1])
                body = f"definitions.{model['@class']}.Builder()"
                if 'nouns' in model:
                    for key, value in model['nouns'].items():
                        if key not in ('__file__','__line__'):
                            if not isinstance(value, list):
                                value = [value]
                            body += ".noun("
                            body += ', '.join([ "'"+key+"'"] + value)
                            body += ")"
                if 'measures' in model:
                    for key, value in model['measures'].items():
                        if key not in ('__file__','__line__'):
                            if not isinstance(value, list):
                                value = [value]
                            body += ".measures("
                            body += ', '.join([ "'"+key+"'"] + value)
                            body += ")"
                body += '.done()'
                defn[path[-1]] = body
            except Exception as e:
                raise RuntimeError(f"{model['__file__']}:{model['__line__']} {e}")

code_lines = []
root.make(code_lines, 0)

print("""#!/usr/bin/env python3
from __future__ import annotations
""")
print('\n'.join(code_lines))
