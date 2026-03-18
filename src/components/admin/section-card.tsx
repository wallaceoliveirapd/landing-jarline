"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface SectionCardProps {
  id: string;
  title: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}

export function SectionCard({ id, title, isEnabled, onToggle, children }: SectionCardProps) {
  return (
    <Card className="border border-zinc-100 shadow-none bg-white rounded-2xl overflow-hidden">
      <Accordion className="w-full">
        <AccordionItem value={id} className="border-none">
          <div className="flex items-center justify-between px-8 py-6">
            <AccordionTrigger className="flex-1 hover:no-underline font-ui font-medium text-lg text-zinc-900 py-0 text-left">
              {title}
            </AccordionTrigger>
            <div className="flex items-center gap-4 ml-4">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${isEnabled ? "text-zinc-900" : "text-zinc-300"}`}>
                {isEnabled ? "Online" : "Offline"}
              </span>
              <Switch checked={isEnabled} onCheckedChange={onToggle} className="data-[state=checked]:bg-primary" />
            </div>
          </div>
          <AccordionContent className="px-8 pb-10 space-y-6">
            {!isEnabled && (
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 mb-4">
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest font-ui">Status: Desativado</p>
                <p className="text-zinc-400 text-sm mt-1">Esta seção está oculta na landing page principal.</p>
              </div>
            )}
            <div className="pt-4">
              {children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
