import {Point2} from '../../common/math/Point2';
import {FCurve} from '../brep/FCurve';
import {RCurve} from '../RCurve';

export class SplineCurve extends FCurve {

   public points;

   public constructor(points) {
      super();
      this.points = (points == undefined) ? [] : points;
   }

   public getPoint(t) {
      var points = this.points;
      var point = (points.length - 1) * t;
      var intPoint = Math.floor(point);
      var weight = point - intPoint;
      var point0 = points[intPoint === 0 ? intPoint : intPoint - 1];
      var point1 = points[intPoint];
      var point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
      var point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];
      var interpolate = RCurve.interpolate;
      return new Point2(
         interpolate(point0.x, point1.x, point2.x, point3.x, weight),
         interpolate(point0.y, point1.y, point2.y, point3.y, weight)
      )
   }
}
