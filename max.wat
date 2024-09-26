(module
  ;; Returns the max of two i32 values.
  (func (export "max") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    (i32.gt_s (local.get 0) (local.get 1))
    select
  )
)
