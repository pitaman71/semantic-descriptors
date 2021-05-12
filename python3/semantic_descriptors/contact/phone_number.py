#!/usr/bin/env python3
from __future__ import annotations
from semantic_descriptors import native

from elevated_objects import serializable

class Any:
    pass

class ShorthandFormat(Any):
    shorthand: native.String

    def marshal(self, visitor:serializable.Visitor):
        visitor.begin(self)
        super().marshal(visitor)
        visitor.verbatim(native.String, self, 'shorthand')
        visitor.end(self)

class RegionalFormats(Any):
    class NorthAmerican(Any):
        area_code: native.String
        local_number: native.String

        def marshal(self, visitor:serializable.Visitor):
            visitor.begin(self)
            super().marshal(visitor)
            visitor.primitive(native.String, self, 'area_code')
            visitor.primitive(native.String, self, 'local_number')
            visitor.end(self)
