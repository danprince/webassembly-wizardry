;; This program evaluates the Brainfuck program in memory.
;;
;; >	Increment the data pointer by one (to point to the next cell to the right).
;; <	Decrement the data pointer by one (to point to the next cell to the left).
;; +	Increment the byte at the data pointer by one.
;; -	Decrement the byte at the data pointer by one.
;; .	Output the byte at the data pointer.
;; ,	Accept one byte of input, storing its value in the byte at the data pointer.
;; [	If the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching ] command.
;; ]	If the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching [ command.[a]
;;
;; Characters from outside of this set should be ignored as comments.

(module
  ;; Function to call whenever we are required to output a byte.
  (import "std" "out" (func $output (param i32)))

  ;; Allocate two pages of memory.grow
  ;; 1. For the program.
  ;; 2. For the data values.
  (memory (export "memory") 2)

  (func (export "run") (param $input i32) (result i32)
    ;; SOLVE
  )
)
