
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ValidationRule } from "@/utils/validationUtils";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  onClose: () => void;
  initialRules?: ValidationRule[];
  onRulesChange?: (rules: ValidationRule[]) => void;
}

const AdminPanel = ({ 
  onClose, 
  initialRules = [],
  onRulesChange 
}: AdminPanelProps) => {
  const { toast } = useToast();
  const [rules, setRules] = useState<ValidationRule[]>(() => {
    // Use initial rules if provided, otherwise use from localStorage
    if (initialRules.length > 0) {
      return initialRules;
    }
    
    const savedRules = localStorage.getItem('validationRules');
    return savedRules ? JSON.parse(savedRules) : [];
  });

  const handleRuleToggle = (ruleId: string, checked: boolean) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, active: checked } : rule
      )
    );
  };

  const saveChanges = () => {
    localStorage.setItem('validationRules', JSON.stringify(rules));
    
    if (onRulesChange) {
      onRulesChange(rules);
    }
    
    toast({
      title: "Settings saved",
      description: "Your validation rule changes have been applied",
    });
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Validation Settings</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3">Validation Rules</h3>
          
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{rule.name}</p>
                <p className="text-sm text-gray-500">{rule.description}</p>
              </div>
              <Switch
                checked={rule.active}
                onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
              />
            </div>
          ))}
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Additional Settings</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-slide-length">Max Slide Length</Label>
                  <Input id="max-slide-length" type="number" defaultValue={1000} />
                </div>
                <div>
                  <Label htmlFor="max-paragraph-length">Max Paragraph Length</Label>
                  <Input id="max-paragraph-length" type="number" defaultValue={200} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="slide-template">Default Slide Template</Label>
                <Textarea 
                  id="slide-template" 
                  placeholder="Enter default template for new slides..."
                  defaultValue="# Slide Title\n\nContent goes here\n\n- Bullet point 1\n- Bullet point 2"
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
