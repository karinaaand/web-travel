import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

interface AuthSplitLayoutProps {
  hero: React.ReactNode;
  eyebrow: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  heroVariant?: 'soft' | 'warm';
}

export function AuthSplitLayout({
  hero,
  eyebrow,
  title,
  description,
  children,
  heroVariant = 'soft',
}: AuthSplitLayoutProps) {
  return (
    <div className="container grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <Card variant={heroVariant} className="overflow-hidden border-white/40">
        {hero}
      </Card>

      <Card className="border-white/70 bg-white/88">
        <CardHeader className="space-y-3">
          <div>{eyebrow}</div>
          <CardTitle className="text-2xl sm:text-[2rem]">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
