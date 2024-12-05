import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { TaxInput } from '../../type';

const formSchema = z.object({
  taxCode: z.string(),
  companyName: z.string().optional(),
  address: z.string().optional(),
});

type Props = {
  onClose: () => void;
  onSubmit: (value: TaxInput) => void;
};

export default function FormImport({ onClose, onSubmit }: Props) {
  const form = useForm<TaxInput>({
    resolver: zodResolver(formSchema),
  });

  function onSubmitForm(values: TaxInput) {
    try {
      onSubmit(values);
      onClose();
      form.reset();
    } catch {
      toast.error('Vui lòng điền đúng thông tin');
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập thủ công</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-2 max-w-3xl mx-auto py-2"
              >
                <FormField
                  control={form.control}
                  name="taxCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mã số thuế
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập mã số thuế"
                          type=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên công ty</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên công ty"
                          type=""
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập địa chỉ"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button type="submit">Xác nhận</Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
