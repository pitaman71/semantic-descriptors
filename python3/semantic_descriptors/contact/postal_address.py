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

class NationalFormat(Any):
    class US(Any):
        address_line_1: native.String
        address_line_2: native.String
        city: native.String
        state: native.String
        country: native.String
        postal: native.String

        def marshal(self, visitor:serializable.Visitor):
            visitor.begin(self)
            super().marshal(visitor)
            visitor.primitive(native.String, self, 'address_line_1')
            visitor.primitive(native.String, self, 'address_line_2')
            visitor.primitive(native.String, self, 'city')
            visitor.primitive(native.String, self, 'state')
            visitor.primitive(native.String, self, 'country')
            visitor.primitive(native.String, self, 'postal')
            visitor.end(self)
