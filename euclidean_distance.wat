(module
  ;; Return the Euclidean distance between x0,y0 and x1,y1.
  ;; https://en.wikipedia.org/wiki/Euclidean_distance
  (func (export "euclidean") (param $x0 f32) (param $y0 f32) (param $x1 f32) (param $y1 f32) (result f32)
    (local $dx f32)
    (local $dy f32)
    (local.set $dx (f32.sub (local.get $x1) (local.get $x0)))
    (local.set $dy (f32.sub (local.get $y1) (local.get $y0)))
    (f32.sqrt
      (f32.add
        (f32.mul (local.get $dx) (local.get $dx))
        (f32.mul (local.get $dy) (local.get $dy))))
  )
)
