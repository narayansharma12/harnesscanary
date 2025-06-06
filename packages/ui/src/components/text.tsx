import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva } from 'class-variance-authority'

const textVariants = cva('text-base', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    },
    size: {
      0: 'text-1',
      1: 'text-2',
      2: 'text-sm',
      3: 'text-base',
      4: 'text-xl',
      5: 'text-2xl',
      6: 'text-3xl',
      7: 'text-4xl',
      8: 'text-5xl',
      9: 'text-6xl',
      10: 'text-7xl',
      11: 'text-8xl',
      12: 'text-9xl',
      13: 'text-lg'
    },
    trim: {
      normal: '',
      start: '',
      end: '',
      both: ''
    },
    truncate: {
      true: 'truncate'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    color: {
      primary: 'text-cn-foreground-1',
      secondary: 'text-cn-foreground-2',
      tertiary: 'text-cn-foreground-3',
      tertiaryBackground: 'text-cn-foreground-3',
      inherit: 'text-inherit',
      'foreground-4': 'text-cn-foreground-2',
      'foreground-5': 'text-cn-foreground-3'
    },
    wrap: {
      wrap: 'text-wrap',
      nowrap: 'text-nowrap',
      pretty: 'text-pretty',
      balance: 'text-balance'
    }
  }
})

interface TextProps extends React.ComponentProps<'span'> {
  /**
   * Shorthand for changing the default rendered element
   * into a semantically appropriate alternative.
   */
  as?: 'span' | 'div' | 'label' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  /**
   * Change the default rendered element for the one
   * passed as a child, merging their props and behavior.
   */
  asChild?: boolean

  /**
   * Sets the CSS text-align property.
   */
  align?: 'left' | 'center' | 'right'

  /**
   * Sets the text size.
   */
  size?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

  /**
   * Trims the leading whitespace from the start or end
   * of the text.
   */
  trim?: 'normal' | 'start' | 'end' | 'both'

  /**
   * Truncates text with an ellipsis.
   */
  truncate?: boolean

  /**
   * Sets the font-weight property.
   */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'

  /**
   * Sets the color property.
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'tertiaryBackground' | 'foreground-5' | 'foreground-4' | 'inherit'

  /**
   * Controls the wrapping behavior of the text.
   */
  wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'
}

const Text = ({
  className,
  children,
  as,
  asChild,
  align,
  size = 2,
  weight = 'normal',
  color = 'primary',
  trim,
  truncate,
  wrap,
  ...props
}: TextProps) => {
  const Comp = asChild ? Slot : ((as ? as.toString() : 'span') as any)

  return (
    <Comp className={cn(textVariants({ align, size, weight, color, trim, truncate, wrap }), className)} {...props}>
      {children}
    </Comp>
  )
}

Text.displayName = 'Text'

export { Text }
