FROM public.ecr.aws/lambda/python:3.12

# Install dependencies (libgomp1 is needed for LightGBM)
RUN yum update -y && \
    yum install -y libgomp && \
    yum clean all

# Copy requirements and install
COPY requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY backend ${LAMBDA_TASK_ROOT}/backend
COPY data_pipeline ${LAMBDA_TASK_ROOT}/data_pipeline
COPY ml ${LAMBDA_TASK_ROOT}/ml
COPY scripts ${LAMBDA_TASK_ROOT}/scripts

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD ["backend.app.main.handler"]