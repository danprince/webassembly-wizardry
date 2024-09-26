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

  ;; Instruction pointer
  (global $ip (mut i32) (i32.const 0))

  ;; Data pointer
  (global $dp (mut i32) (i32.const 0xffff))

  (func (export "run") (param $input i32) (result i32)
    (local $char i32)

    ;; Store the input byte at the data pointer.
    (i32.store8 (global.get $dp) (local.get $input))

    (loop $loop
      ;; Load the next instruction
      (local.set $char (i32.load8_u (global.get $ip)))

      (block $switch
        ;; Return if we reached the end of the program.
        (if (i32.eqz (local.get $char))
          (then
            (return (i32.const 0))
          )
        )

        ;; >	Increment the data pointer by one (to point to the next cell to the right).
        (if (i32.eq (local.get $char) (i32.const 62))
          (then
            (global.set $dp (i32.add (global.get $dp) (i32.const 1)))
            (br $switch)
          )
        )

        ;; <	Decrement the data pointer by one (to point to the next cell to the left).
        (if (i32.eq (local.get $char) (i32.const 60))
          (then
            (global.set $dp (i32.sub (global.get $dp) (i32.const 1)))
            (br $switch)
          )
        )

        ;; +	Increment the byte at the data pointer by one.
        (if (i32.eq (local.get $char) (i32.const 43))
          (then
            (i32.store8
              (global.get $dp)
              (i32.add (i32.load8_u (global.get $dp)) (i32.const 1))
            )
            (br $switch)
          )
        )

        ;; -	Decrement the byte at the data pointer by one.
        (if (i32.eq (local.get $char) (i32.const 45))
          (then
            (i32.store8
              (global.get $dp)
              (i32.sub (i32.load8_u (global.get $dp)) (i32.const 1))
            )
            (br $switch)
          )
        )

        ;; .	Output the byte at the data pointer.
        (if (i32.eq (local.get $char) (i32.const 46))
          (then
            (call $output (i32.load (global.get $dp)))
            (br $switch)
          )
        )

        ;; ,	Accept one byte of input, storing its value in the byte at the data pointer.
        (if (i32.eq (local.get $char) (i32.const 44))
          (then
            ;; Return with >0 to show that we are waiting for input.
            (return (i32.const 1))
          )
        )

        ;; [  If the byte at the data pointer is zero, then instead of moving the
        ;; instruction pointer forward to the next command, jump it forward to
        ;; the command after the matching ] command.
        (if (i32.eq (local.get $char) (i32.const 91))
          (then
            (call $jump (i32.const 1) (i32.const 91) (i32.const 93))
            (br $switch)
          )
        )

        ;; ]	If the byte at the data pointer is nonzero, then instead of moving
        ;; the instruction pointer forward to the next command, jump it back to
        ;; the command after the matching [ command.
        (if (i32.eq (local.get $char) (i32.const 93))
          (then
            (call $jump (i32.const -1) (i32.const 93) (i32.const 91))
            (br $switch)
          )
        )

        ;; If we made it here that means we're on a character that is not a
        ;; brainfuck command, these act as comments, so just skip it.
      )

      ;; Increment the instruction pointer.
      (global.set $ip (i32.add (global.get $ip) (i32.const 1)))

      br $loop
    )

    unreachable
  )

  ;; Jump to the matching bracket in a specific direction.
  ;;
  ;; @param $dir The direction to jump in (-1 or 1)
  ;; @param $start The char we're starting from.
  ;; @param $end The char we're ending at.
  (func $jump (param $dir i32) (param $start i32) (param $end i32)
    (local $i i32)
    (local $char i32)
    (local $depth i32)

    (local.set $i (global.get $ip))

    (loop $loop
      ;; Increment $i by $dir
      (local.set $i (i32.add (local.get $i) (local.get $dir)))

      ;; Read the character
      (local.set $char (i32.load8_u (local.get $i)))

      ;; Panic if we left the program data.
      (if (i32.eqz (local.get $char))
        (then (unreachable))
      )

      ;; If we're at another $start character then increase the depth
      (if (i32.eq (local.get $char) (local.get $start))
        (then
          (local.set $depth (i32.add (local.get $depth) (i32.const 1)))
        )
      )

      ;; If we're at an $end $character
      (if (i32.eq (local.get $char) (local.get $end))
        (then
          (if (i32.eqz (local.get $depth))
            ;; If $depth is 0, we're done
            (then
              (global.set $ip (local.get $i))
            )
            ;; Otherwise, decrement $depth.
            (else
              (local.set $depth (i32.sub (local.get $depth) (i32.const 1)))
            )
          )
        )
      )

      br $loop
    )

    unreachable
  )
)
