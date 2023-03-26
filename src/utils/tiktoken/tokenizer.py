import tiktoken

# initialize the tokenizer
enc = tiktoken.encoding_for_model('__model__')

print(enc.encode('__content__'))