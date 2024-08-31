/**
 * Componente <Text> personalizado para aplicações React que utiliza a biblioteca tailwind-variants.
 * Permite a aplicação de estilos de texto de forma dinâmica e responsiva baseada em Tailwind CSS.
 *
 * A propriedade 'variant' aceita valores pré-definidos como 'headline-24-45-700', onde:
 * - 'headline' é o tipo de texto,
 * - '24px' é o tamanho da fonte para mobile,
 * - '45px' é o tamanho máximo da fonte, geralmente para desktop,
 * - '700' refere-se ao font-weight.
 *
 * Estas variantes já estão configuradas para serem responsivas, com tamanhos ajustados automaticamente para mobile, tablet e desktop seguindo o design system especificado.
 *
 * A propriedade 'size' aceita valores fixos como 'display-large', 'headline-medium', até 'label-small', controlando o tamanho do texto.
 *
 * A propriedade 'weight' define o peso da fonte, aceitando valores como 'regular', 'medium', e 'bold'.
 *
 * O parâmetro 'as' define a tag HTML que será usada para renderizar o texto, sendo '<p>' a tag padrão.
 *
 * O componente é flexível e permite passar classes adicionais através da prop 'className', assim como outras props padrão do elemento escolhido via 'as'.
 */

import React, { ReactNode } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

export const text = tv({
  base: '',
  variants: {
    variant: {
      'advertence-32-72-700':
        'font-sans700 text-[32px] leading-[40px] tracking-normal sm:text-6xl sm:leading-none sm:tracking-normal lg:text-7xl',
      'headline-24-45-700':
        'font-sans700 text-[24px] leading-[32px] tracking-normal sm:text-[32px] sm:leading-[40px] lg:text-[45px] lg:leading-[52px]',
      'headline-24-45-500':
        'font-sans500 text-[24px] leading-[32px] tracking-normal sm:text-[32px] sm:leading-[40px] lg:text-[45px] lg:leading-[52px]',
      'title-22-36-500':
        'font-sans500 text-[22px] leading-[28px] tracking-normal sm:text-[32px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px]',
      'title-22-32-500':
        'font-sans500 text-[22px] leading-[28px] tracking-normal sm:text-[24px] sm:leading-[32px] lg:text-[32px] lg:leading-[40px]',
      'title-18-24-700':
        'font-sans700 text-[18px] leading-[24px] tracking-[0.15px] md:text-[22px] md:leading-[28px] md:tracking-normal lg:text-[24px] lg:leading-[32px]',
      'title-18-24-400':
        'font-sans400 text-[18px] leading-[24px] tracking-[0.15px] md:text-[22px] md:leading-[28px] md:tracking-normal lg:text-[24px] lg:leading-[32px]',
      'title-16-18-500':
        'font-sans500 text-[16px] leading-[24px] tracking-[0.15px] lg:text-[18px]',
      'title-16-16-500':
        'font-sans500 text-[16px] leading-[24px] tracking-[0.15px]',
      'title-14-16-500':
        'font-sans500 text-[14px] leading-[20px] tracking-[0.1px] lg:text-[16px] lg:leading-[24px] lg:tracking-[0.15px]',
      'body-16-24-400':
        'font-sans400 text-[16px] leading-[24px] tracking-[0.5px] lg:text-[24px] lg:leading-[32px] lg:tracking-normal',
      'body-16-18-400':
        'font-sans400 text-[16px] leading-[24px] tracking-[0.5px] lg:text-[18px] lg:tracking-[0.15px]',
      'body-16-16-400':
        'font-sans400 text-[16px] leading-[24px] tracking-[0.5px]',
      'label-14-16-400':
        'font-sans400 text-[14px] leading-[20px] tracking-[0.1px] lg:text-[16px] lg:leading-[24px] lg:tracking-[0.5px]',
      'label-14-14-400':
        'font-sans400 text-[14px] leading-[20px] tracking-[0.1px]',
      'button-14-14-500':
        'font-sans500 text-[14px] leading-[20px] tracking-[0.1px]',
    },
    size: {
      'display-large': 'text-[57px] leading-[64px] -tracking-[0.25px]',
      'display-medium': 'text-[45px] leading-[52px] tracking-normal',
      'display-small': 'text-[36px] leading-[44px] tracking-normal',
      'headline-large': 'text-[32px] leading-[40px] tracking-normal',
      'headline-medium': 'text-[28px] leading-[36px] tracking-normal',
      'headline-small': 'text-[24px] leading-[32px] tracking-normal',
      'title-large': 'text-[22px] leading-[28px] tracking-normal',
      'title-medium-lg': 'text-[18px] leading-[24px] tracking-[0.15px]',
      'title-medium': 'text-[16px] leading-[24px] tracking-[0.15px]',
      'title-small': 'text-[14px] leading-[20px] tracking-[0.1px]',
      'body-large': 'text-[16px] leading-[24px] tracking-[0.5px]',
      'body-medium': 'text-[14px] leading-[20px] tracking-[0.25px]',
      'body-small': 'text-[12px] leading-[16px] tracking-[0.4px]',
      'label-large': 'text-[14px] leading-[20px] tracking-[0.1px]',
      'label-medium': 'text-[12px] leading-[16px] tracking-[0.5px]',
      'label-small': 'text-[11px] leading-[16px] tracking-[0.5px]',
    },
    weight: {
      regular: 'font-sans400',
      medium: 'font-sans500',
      bold: 'font-sans700',
    },
  },
})

type PropsOf<
  E extends
    | keyof React.JSX.IntrinsicElements
    | React.JSXElementConstructor<any>,
> = React.JSX.LibraryManagedAttributes<E, React.ComponentPropsWithRef<E>>

export interface IText<E extends React.ElementType = React.ElementType> {
  as?: E
  className?: string
  variant?: VariantProps<typeof text>['variant']
  size?: VariantProps<typeof text>['size']
  weight?: VariantProps<typeof text>['weight']
  children: ReactNode
}

export type ITextProps<E extends React.ElementType> = IText<E> &
  Omit<PropsOf<E>, keyof IText>

export function Text<E extends React.ElementType = 'p'>({
  as,
  children,
  className,
  size,
  weight,
  variant,
  ...props
}: ITextProps<E>) {
  const Component = as || 'p'

  const composedTextStyles = text({ className, size, weight, variant })

  return (
    <Component {...props} className={composedTextStyles}>
      {children}
    </Component>
  )
}
