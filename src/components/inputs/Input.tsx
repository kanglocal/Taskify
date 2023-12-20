import React, { ReactNode, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TagChip from '@/components/chips/TagChip';
import { IconCalendar, IconGreater, IconLess } from '@/public/svgs';

type Props = {
  title?: string;
  required?: boolean;
  value?: string | number;
  type?: 'text' | 'date' | 'tag' | 'comment';
  placeholder?: string;
  children?: React.ReactNode;
  onInput?: React.ChangeEventHandler<HTMLInputElement>;
};

function Label({ title, required }: Props) {
  return (
    <label className='text-[18px] font-[500]'>
      {title}
      {required ? <span className='text-[#5534DA]'> *</span> : ''}
    </label>
  );
}

function TextInput({ children, ...rest }: { children: ReactNode }) {
  return (
    <input className='input' {...rest}>
      {children}
    </input>
  );
}

function CommentInput({ children, ...rest }: { children: ReactNode }) {
  return (
    <textarea className='textarea' {...rest}>
      {children}
    </textarea>
  );
}

function DateInput() {
  const handleChange = (e: React.ChangeEvent) => {
    e.preventDefault();
  };
  const [value, setValue]: [Date | null, Function] = useState(null);
  const YEARS = Array.from(
    { length: new Date().getFullYear() + 1 - 2000 },
    (_, i) => new Date().getFullYear() - i,
  );
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className='flex justify-between'>
          <div>
            <span className='ml-12 font-bold'>{MONTHS[date.getMonth()]}</span>
            <select
              value={date.getFullYear()}
              className='font-bold outline-none'
              onChange={({ target: { value } }) => changeYear(+value)}
            >
              {YEARS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className='mr-12 flex gap-12'>
            <button
              type='button'
              onClick={decreaseMonth}
              className=''
              disabled={prevMonthButtonDisabled}
            >
              <IconLess className='h-12 w-12' />
            </button>
            <button
              type='button'
              onClick={increaseMonth}
              className=''
              disabled={nextMonthButtonDisabled}
            >
              <IconGreater className='h-12 w-12' />
            </button>
          </div>
        </div>
      )}
      showYearDropdown
      scrollableYearDropdown
      dateFormat='yyyy.MM.dd HH:mm'
      dateFormatCalendar='yyyy년 MM월'
      showTimeSelect
      timeFormat='HH:mm'
      timeIntervals={30}
      timeCaption='시간'
      showPopperArrow={false}
      fixedHeight
      className='input'
      placeholderText='날짜를 입력해 주세요'
      showIcon
      selected={value}
      onChange={(date: Date) => setValue(date)}
      icon={<IconCalendar />}
      onChangeRaw={handleChange}
    />
  );
}

function TagInput({ children, ...rest }: { children: ReactNode }) {
  const [tagItem, setTagItem] = useState<string>('');
  const [tagList, setTagList] = useState<string[]>([]);
  const handleTagValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);
    const target = e.target as HTMLInputElement;
    if (e.key === 'Enter' && target.value.length !== 0) {
      addTagItem();
      return;
    }
    if (e.key === 'Backspace' && tagList.length !== 0) {
      deleteTagItem(tagList.length - 1);
    }
  };

  const addTagItem = () => {
    let updatedTagList = [...tagList];
    updatedTagList.push(tagItem);
    setTagList(updatedTagList);
    setTagItem('');
  };

  const deleteTagItem = (index: number) => {
    const filteredTagList = [...tagList];
    filteredTagList.splice(index, 1);
    setTagList(filteredTagList);
  };

  return (
    <div className='input'>
      <div className='flex items-center gap-8'>
        {tagList.map((tagItem, index) => {
          return (
            <div className='flex shrink-0' key={index}>
              <TagChip str={tagItem}>
                <button
                  key={index}
                  className='text-8 ml-5 text-gray-5 tablet:h-20 tablet:text-10'
                  onClick={() => deleteTagItem(index)}
                >
                  X
                </button>
              </TagChip>
            </div>
          );
        })}

        <input
          className='input-no-style'
          {...rest}
          onKeyUp={handleTagValue}
          onChange={(e) => setTagItem(e.target.value)}
          value={tagItem}
        >
          {children}
        </input>
      </div>
    </div>
  );
}

function SelectedInput({ type, children, ...rest }: Props) {
  switch (type) {
    case 'text':
      return <TextInput {...rest}>{children}</TextInput>;
    case 'date':
      return <DateInput />;
    case 'comment':
      return <CommentInput {...rest}>{children}</CommentInput>;
    case 'tag':
      return <TagInput {...rest}>{children}</TagInput>;
  }
}

function Input({
  title,
  type = 'text',
  required = false,
  children,
  ...rest
}: Props) {
  return (
    <div className='flex flex-col gap-[10px]'>
      <Label title={title} required={required} />
      <SelectedInput type={type} {...rest}>
        {children}
      </SelectedInput>
    </div>
  );
}

export default Input;
