(module
  (memory (export "memory") 1)

  ;; Find the mean of the first $n f32 numbers in memory.
  ;; If $n <= 0, return 0.
  ;;
  ;; See https://en.wikipedia.org/wiki/Arithmetic_mean
  (func (export "mean") (param $n i32) (result f32)
    ;; SOLVE
  )
)
