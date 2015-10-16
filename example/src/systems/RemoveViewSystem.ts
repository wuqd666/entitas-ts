module example {

  import IMatcher = entitas.IMatcher;
  import IComponent = entitas.IComponent;
  import IMultiReactiveSystem = entitas.IMultiReactiveSystem;
  import ISetPool = entitas.ISetPool;
  import IEnsureComponents = entitas.IEnsureComponents;
  import TriggerOnEvent = entitas.TriggerOnEvent;
  import CoreMatcher = entitas.CoreMatcher;
  import Matcher = entitas.Matcher;
  import Entity = entitas.Entity;
  import Pool = entitas.Pool;
  import Group = entitas.Group;

  declare var viewContainer;

  export class RemoveViewSystem implements IMultiReactiveSystem, ISetPool, IEnsureComponents {

    public get triggers():TriggerOnEvent[] {
      return [
        <TriggerOnEvent>CoreMatcher.Resource.onEntityRemoved(),
        <TriggerOnEvent>(<Matcher>Matcher.allOf(CoreMatcher.Resource, CoreMatcher.Destroy)).onEntityAdded()
      ];
    }

    public get ensureComponents():IMatcher {
      return CoreMatcher.View;
    }


    public setPool(pool:Pool) {
      pool.getGroup(CoreMatcher.View).onEntityRemoved.add(this.onEntityRemoved);
    }

    protected onEntityRemoved(group:Group, entity:Entity, index:number, component:IComponent) {
      viewContainer.removeChild((<ViewComponent>component).sprite);

    }

    public execute(entities:Array<Entity>) {
      for (var i = 0, l = entities.length; i < l; i++) {
        var e = entities[i];
        e.removeView();
      }
    }
  }
}

