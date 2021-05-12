#!/usr/bin/env python3
from __future__ import annotations

from elevated_objects import serializable

class Any:
    pass

class String(Any):
    value: str

    def marshal(self, visitor:serializable.Visitor):
        visitor.begin(self)
        super().marshal(visitor)
        visitor.verbatim(str, self, 'value')
        visitor.end(self)
