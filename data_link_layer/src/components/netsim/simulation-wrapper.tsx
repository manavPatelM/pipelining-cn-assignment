import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SimulationWrapperProps = {
  title: string;
  description: string;
  children: ReactNode;
  id: string;
};

export default function SimulationWrapper({
  title,
  description,
  children,
  id,
}: SimulationWrapperProps) {
  return (
    <section id={id} className="w-full scroll-mt-20">
      <Card className="shadow-lg transition-shadow hover:shadow-xl bg-card/80">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary font-headline">
            {title}
          </CardTitle>
          <CardDescription className="text-md">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}
