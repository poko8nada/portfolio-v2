import {
  FileText,
  Home,
  Lock,
  type LucideIcon,
  Mail,
  User,
  Wrench,
} from 'lucide-react'

export type IconName = 'Home' | 'User' | 'FileText' | 'Lock' | 'Wrench' | 'Mail'

export const IconMap: Record<IconName, LucideIcon> = {
  Home,
  User,
  FileText,
  Lock,
  Wrench,
  Mail,
}

export function getIcon(iconName: IconName): LucideIcon {
  return IconMap[iconName] || Home
}

export function NavIcon({
  iconName,
  className = '',
}: {
  iconName: IconName
  className?: string
}) {
  const Icon = getIcon(iconName)
  return <Icon className={className} />
}
