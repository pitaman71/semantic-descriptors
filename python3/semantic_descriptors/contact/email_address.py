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
