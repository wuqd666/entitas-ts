module entitas {

  import Entity = entitas.Entity;
  import Component = entitas.IComponent;
  import IAllOfMatcher = entitas.IAllOfMatcher;
  import IAnyOfMatcher = entitas.IAnyOfMatcher;
  import INoneOfMatcher = entitas.INoneOfMatcher;
  import MatcherException = entitas.exceptions.MatcherException;

  export module Matcher {

  }
  export class Matcher implements IAllOfMatcher, IAnyOfMatcher, INoneOfMatcher {

    public get id():number {return this._id;}

    public static uniqueId:number = 0;

    public get indices():number[] {
      if (!this._indices) {
        this._indices = this.mergeIndices();
      }
      return this._indices;
    }

    public get allOfIndices():number[] {return this._allOfIndices;}
    public get anyOfIndices():number[] {return this._anyOfIndices;}
    public get noneOfIndices():number[] {return this._noneOfIndices;}

    private _indices:number[];
    public _allOfIndices:number[];
    public _anyOfIndices:number[];
    public _noneOfIndices:number[];
    private _toStringCache:string;
    private _id:number;

    /** Extension Points */
    public onEntityAdded():TriggerOnEvent;
    public onEntityRemoved():TriggerOnEvent;
    public onEntityAddedOrRemoved():TriggerOnEvent;

    /**
     * @constructor
     *
     */
    constructor() {
      this._id = Matcher.uniqueId++;
    }

    public anyOf(...args:Array<IMatcher>):IAnyOfMatcher;
    public anyOf(...args:number[]):IAnyOfMatcher;

    public anyOf(...args:any[]):IAnyOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        this._anyOfIndices = Matcher.distinctIndices(args);
        this._indices = null;
        return this;
      } else {
        return this.anyOf.apply(this, Matcher.mergeIndices(args));
      }
    }

    public noneOf(...args:number[]):INoneOfMatcher;
    public noneOf(...args:Array<IMatcher>):INoneOfMatcher;

    public noneOf(...args:any[]):INoneOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        this._noneOfIndices = Matcher.distinctIndices(args);
        this._indices = null;
        return this;
      } else {
        return this.noneOf.apply(this, Matcher.mergeIndices(args));
      }
    }

    public matches(entity:Entity):boolean {
      var matchesAllOf = this._allOfIndices == null ? true : entity.hasComponents(this._allOfIndices);
      var matchesAnyOf = this._anyOfIndices == null ? true : entity.hasAnyComponent(this._anyOfIndices);
      var matchesNoneOf = this._noneOfIndices == null ? true : !entity.hasAnyComponent(this._noneOfIndices);
      return matchesAllOf && matchesAnyOf && matchesNoneOf;

    }

    public mergeIndices():number[] {
      //var totalIndices = (this._allOfIndices != null ? this._allOfIndices.length : 0)
      //  + (this._anyOfIndices != null ? this._anyOfIndices.length : 0)
      //  + (this._noneOfIndices != null ? this._noneOfIndices.length : 0);

      var indicesList = [];
      if (this._allOfIndices != null) {
        indicesList = indicesList.concat(this._allOfIndices);
      }
      if (this._anyOfIndices != null) {
        indicesList = indicesList.concat(this._anyOfIndices);
      }
      if (this._noneOfIndices != null) {
        indicesList = indicesList.concat(this._noneOfIndices);
      }

      return Matcher.distinctIndices(indicesList);

    }

    public toString() {
      if (this._toStringCache == null) {
        var sb:string[] = [];
        if (this._allOfIndices != null) {
          Matcher.appendIndices(sb, "AllOf", this._allOfIndices);
        }
        if (this._anyOfIndices != null) {
          if (this._allOfIndices != null) {
            sb[sb.length] = '.';
          }
          Matcher.appendIndices(sb, "AnyOf", this._anyOfIndices);
        }
        if (this._noneOfIndices != null) {
          Matcher.appendIndices(sb, ".NoneOf", this._noneOfIndices);
        }
        this._toStringCache = sb.join('');
      }
      return this._toStringCache;
    }

    public equals(obj) {
      if (obj == null || obj == null) return false;
      var matcher:Matcher = obj;

      if (!Matcher.equalIndices(matcher.allOfIndices, this._allOfIndices)) {
        return false;
      }
      if (!Matcher.equalIndices(matcher.anyOfIndices, this._anyOfIndices)) {
        return false;
      }
      if (!Matcher.equalIndices(matcher.noneOfIndices, this._noneOfIndices)) {
        return false;
      }
      return true;

    }

    public static equalIndices(i1:number[], i2:number[]):boolean {
      if ((i1 == null) != (i2 == null)) {
        return false;
      }
      if (i1 == null) {
        return true;
      }
      if (i1.length !== i2.length) {
        return false;
      }

      for (var i = 0, indicesLength = i1.length; i < indicesLength; i++) {
        /** compare coerced values so we can compare string type to number type */
        if (i1[i] != i2[i]) {
          return false;
        }
      }

      return true;
    }

    public static distinctIndices(indices:number[]):number[] {
      var indicesSet = {};
      for (var i=0, l=indices.length; i<l; i++) {
        var k = ''+indices[i];
        indicesSet[k]=i;
      }
      return [].concat(Object.keys(indicesSet));
    }

    public static mergeIndices(matchers:Array<IMatcher>):number[] {

      var indices = [];
      for (var i = 0, matchersLength = matchers.length; i < matchersLength; i++) {
        var matcher = matchers[i];
        if (matcher.indices.length !== 1) {
          throw new MatcherException(matcher);
        }
        indices[i] = matcher.indices[0];
      }
      return indices;
    }

    public static allOf(...args:number[]):IAllOfMatcher;
    public static allOf(...args:Array<IMatcher>):IAllOfMatcher;

    public static allOf(...args:any[]):IAllOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        var matcher = new Matcher();
        var indices = matcher._allOfIndices = Matcher.distinctIndices(args);
        return matcher;
      } else {
        return Matcher.allOf.apply(this, Matcher.mergeIndices(args));
      }

    }

    public static anyOf(...args:number[]):IAnyOfMatcher;
    public static anyOf(...args:Array<IMatcher>):IAnyOfMatcher;

    public static anyOf(...args:any[]):IAnyOfMatcher {
      if ('number' === typeof args[0] || 'string' === typeof args[0]) {
        var matcher = new Matcher();
        var indices = matcher._anyOfIndices = Matcher.distinctIndices(args);
        return matcher;
      } else {
        return Matcher.anyOf.apply(this, Matcher.mergeIndices(args));
      }
    }

    private static appendIndices(sb:string[], prefix:string, indexArray:number[]) {
      const SEPERATOR = ", ";
      var j = sb.length;
      sb[j++] = prefix;
      sb[j++] = '(';
      var lastSeperator = indexArray.length - 1;
      for (var i = 0, indicesLength = indexArray.length; i < indicesLength; i++) {
        sb[j++] = ''+indexArray[i];
        if (i < lastSeperator) {
          sb[j++] = SEPERATOR;
        }
      }
      sb[j++] = ')';
    }

    //public onEntityAdded():TriggerOnEvent {
    //  return new TriggerOnEvent(this, GroupEventType.OnEntityAdded);
    //}

    //public onEntityRemoved():TriggerOnEvent {
    //  return new TriggerOnEvent(this, GroupEventType.OnEntityRemoved);
    //}

    //public onEntityAddedOrRemoved():TriggerOnEvent {
    //  return new TriggerOnEvent(this, GroupEventType.OnEntityAddedOrRemoved);
    //}

  }
}

